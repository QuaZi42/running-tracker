import { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const START = [-71.35375025269208, 42.459403089874165];
const END = [-121.91614025881732, 37.765293505678414];

export default function RunningProgressTracker() {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [runs, setRuns] = useState([]);
  const [name, setName] = useState("");
  const [miles, setMiles] = useState("");
  const [route, setRoute] = useState(null);
  const [routeDistance, setRouteDistance] = useState(null);
  const [mapError, setMapError] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  const totalMiles = useMemo(
    () => runs.reduce((sum, r) => sum + r.miles, 0),
    [runs]
  );

  const progress = routeDistance ? Math.min(totalMiles / routeDistance, 1) : 0;

  // fetch existing runs + subscribe to real-time changes
  useEffect(() => {
    supabase
      .from("runs")
      .select("*")
      .order("created_at", { ascending: true })
      .then(({ data, error }) => {
        if (error) console.error("Failed to fetch runs:", error);
        else setRuns(data);
      });

    const channel = supabase
      .channel("runs-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "runs" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setRuns((prev) => [...prev, payload.new]);
          } else if (payload.eventType === "DELETE") {
            setRuns((prev) => prev.filter((r) => r.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // map setup
  useEffect(() => {
    if (mapRef.current) return;

    if (!mapboxgl.supported()) {
      setMapError(true);
      return;
    }

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: START,
      zoom: 3,
      accessToken: import.meta.env.VITE_MAPBOX_TOKEN,
    });

    mapRef.current = map;

    map.on("load", async () => {
      const token = import.meta.env.VITE_MAPBOX_TOKEN;
      try {
        const res = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${START.join(",")};${END.join(",")}?geometries=geojson&access_token=${token}&overview=full`
        );
        const data = await res.json();
        const routeData = data.routes[0];

        setRoute(routeData.geometry.coordinates);
        setRouteDistance(routeData.distance / 1609.34);

        map.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: routeData.geometry.coordinates,
            },
          },
        });

        map.addLayer({
          id: "route",
          type: "line",
          source: "route",
          paint: { "line-width": 5 },
        });

        
        map.addSource("progress", { type: "geojson", data: { type: "Feature", geometry: { type: "LineString", coordinates: [] } }});

        map.addLayer({
          id: "progress-line",
          type: "line",
          source: "progress",
          paint: {
            "line-width": 6,
            "line-color": "#22c55e", // green
            "line-cap": "round"
          }
        });

        markerRef.current = new mapboxgl.Marker()
          .setLngLat(START)
          .addTo(map);
      } catch (e) {
        console.error("Failed to load route:", e);
        setMapError(true);
      }
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // marker position
  useEffect(() => {
    if (!route || !markerRef.current || !routeDistance) return;

    const targetMiles = Math.min(totalMiles, routeDistance);

    let cumulative = [0];
    for (let i = 1; i < route.length; i++) {
      const [lng1, lat1] = route[i - 1];
      const [lng2, lat2] = route[i];
      const dlng = (lng2 - lng1) * Math.cos((lat1 * Math.PI) / 180);
      const dlat = lat2 - lat1;
      const distDeg = Math.sqrt(dlng * dlng + dlat * dlat);
      const distMiles = distDeg * 69.11;
      cumulative.push(cumulative[i - 1] + distMiles);
    }

    const totalRouteMiles = cumulative[cumulative.length - 1];
    const targetDist = (targetMiles / routeDistance) * totalRouteMiles;

    let i = 0;
    while (i < cumulative.length - 1 && cumulative[i + 1] < targetDist) i++;

    const segLen = cumulative[i + 1] - cumulative[i];
    const t = segLen > 0 ? (targetDist - cumulative[i]) / segLen : 0;

    const a = route[i];
    const b = route[Math.min(i + 1, route.length - 1)];
    const lng = a[0] + (b[0] - a[0]) * t;
    const lat = a[1] + (b[1] - a[1]) * t;

    markerRef.current.setLngLat([lng, lat]);
  }, [totalMiles, route, routeDistance]);

  const addRun = async () => {
    const parsedMiles = parseFloat(miles);

    // Better validation + logging
    if (!name?.trim()) {
      console.warn("Name is required");
      alert("Please enter a name");
      return;
    }
    if (isNaN(parsedMiles) || parsedMiles <= 0) {
      console.warn("Invalid miles:", miles);
      alert("Please enter a valid number of miles");
      return;
    }

    console.log("Attempting to insert:", { name: name.trim(), miles: parsedMiles });

    const { data, error } = await supabase
      .from("runs")
      .insert({ 
        name: name.trim(), 
        miles: parsedMiles 
      })
      .select();   // ← add .select() to get the inserted row back

    if (error) {
      console.error("Supabase insert error:", error);
      alert(`Failed to add run: ${error.message}`);
    } else {
      console.log("Successfully inserted:", data);
      setName("");
      setMiles("");
      // Optional: you can manually add it too as backup
      // setRuns(prev => [...prev, data[0]]);
    }
  };

  const deleteRun = async (id) => {
    const { error } = await supabase.from("runs").delete().eq("id", id);
    if (error) console.error("Failed to delete run:", error);
    setPendingDelete(null);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Group Running Journey</h2>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Miles"
        type="number"
        value={miles}
        onChange={(e) => setMiles(e.target.value)}
      />
      <button onClick={addRun} disabled={!routeDistance}>
        Add
      </button>

      {routeDistance && (
        <p>
          {totalMiles.toFixed(1)} / {routeDistance.toFixed(0)} miles (
          {(progress * 100).toFixed(0)}%)
        </p>
      )}

      {mapError && (
        <p style={{ color: "red" }}>
          Map failed to load. Check your token and WebGL support.
        </p>
      )}

      <div ref={mapContainer} style={{ height: "400px", marginTop: "20px" }} />

      <ul>
        {runs.map((r) => (
          <li key={r.id} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span>{r.name}: {r.miles} mi</span>
            {pendingDelete === r.id ? (
              <>
                <button onClick={() => deleteRun(r.id)}>Confirm</button>
                <button onClick={() => setPendingDelete(null)}>Cancel</button>
              </>
            ) : (
              <button onClick={() => setPendingDelete(r.id)}>Remove</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
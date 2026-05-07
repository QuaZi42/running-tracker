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

const RUNNERS = {
  andrii: {
    displayName: "Andrii",
    image:
      "https://static.vecteezy.com/system/resources/thumbnails/047/554/713/small/runner-woman-isolated-on-transparent-background-free-png.png",
  },

  ryan: {
    displayName: "Ryan",
    image:
      "https://static.vecteezy.com/system/resources/thumbnails/047/554/713/small/runner-woman-isolated-on-transparent-background-free-png.png",
  },
  nathan: {
    displayName: "Nathan",
    image:
      "https://i.postimg.cc/TYHb0qQ1/image.png",
  },
};

const milestones = [
  {
    name: "Chicago, IL",
    miles: 961.8,
    image:
      "https://cdn.craft.cloud/101e4579-0e19-46b6-95c6-7eb27e4afc41/assets/uploads/pois/chicago-illinois-frommers.jpg?fit=cover&height=630&width=1200&s=MWfr79bwHIhjNMa-ds4td5LEsr0JeCbUBoMune808xE",
  },

  {
    name: "Cleveland, OH",
    miles: 628.1,
    image:
      "https://img1.10bestmedia.com/Images/Photos/372221/Cleveland-Letters-at-Edgewater-Park-Normal-Edit-2_54_990x660.jpg?auto=webp&width=3840&quality=75",
  },

  {
    name: "Albany, NY",
    miles: 165.9,
    image:
      "https://i.postimg.cc/CKm212S3/image.png",
  },

  {
    name: "Syracuse, NY",
    miles: 305.0,
    image:
      "https://www.syracuse.edu/images/yf81g4_AEW-FcB6qaBQXLcSAFug=/5960/width-1300/SFS-Fall-Campus-Scenes-Roofs.jpg",
  },

  {
    name: "Salt Lake City, UT",
    miles: 2400,
    image:
      "https://images.unsplash.com/photo-1519874179391-3ebc752241dd?auto=format&fit=crop&w=1600&q=80",
  },

  {
    name: "San Francisco, CA",
    miles: 3200,
    image:
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1600&q=80",
  },
];

const imageCache = {};

async function loadImage(url) {
  if (imageCache[url]) return imageCache[url];

  return new Promise((resolve, reject) => {
    const img = new Image();

    img.crossOrigin = "anonymous";

    img.onload = () => {
      imageCache[url] = img;
      resolve(img);
    };

    img.onerror = reject;

    img.src = url;
  });
}


export default function RunningProgressTracker() {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [runs, setRuns] = useState([]);
  const [name, setName] = useState("");
  const [miles, setMiles] = useState("");
  const [postcards, setPostcards] = useState([]);
  const [generatedPostcards, setGeneratedPostcards] =
  useState(new Set());

  const [showLog, setShowLog] = useState(false);
  const [showPostcards, setShowPostcards] = useState(false);

  const [date, setDate] = useState(() => {
    const d = new Date();
    const offset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - offset * 60000);
    return local.toISOString().split("T")[0];
  });

  const [route, setRoute] = useState(null);
  const [routeDistance, setRouteDistance] = useState(null);
  const [mapError, setMapError] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  
  const generatingRef = useRef(new Set());

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
      .order("date", { ascending: true })
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
            setRuns((prev) =>
              [...prev, payload.new].sort(
                (a, b) => new Date(a.date) - new Date(b.date)
              )
            );
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
  // marker position AND progress line update
  useEffect(() => {
    if (!route || !markerRef.current || !routeDistance || !mapRef.current) return;

    const targetMiles = Math.min(totalMiles, routeDistance);

    // ... (Keep your existing distance calculation logic) ...
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

    const currentPos = [lng, lat];

    markerRef.current.setLngLat(currentPos);

    // UPDATE THE GREEN LINE 
    const progressSource = mapRef.current.getSource("progress");
    if (progressSource) {
      // We take the route up to the current segment, then add the exact interpolated point
      const progressCoords = [...route.slice(0, i + 1), currentPos];
      
      progressSource.setData({
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: progressCoords,
        },
      });
    }
  }, [totalMiles, route, routeDistance]);

  useEffect(() => {
    async function checkMilestones() {
      const existing = new Set(generatedPostcards);

      const newPostcards = [];
      const newKeys = [];

      let previousMiles = 0;
      let currentMiles = 0;

      for (const run of runs) {
        currentMiles += run.miles;

        for (const city of milestones) {
          const crossedNow =
            previousMiles < city.miles &&
            currentMiles >= city.miles;

         if (
          crossedNow &&
          !existing.has(city.name) &&
          !generatingRef.current.has(city.name)
        ) {
          generatingRef.current.add(city.name);

            const postcard =
              await generatePostcard(
                city,
                run.name
              );

            if (!postcard) {
              generatingRef.current.delete(city.name);
              continue;
            }
            generatingRef.current.delete(city.name);

            newPostcards.push({
              city: city.name,
              miles: city.miles,
              runner: run.name,
              image: postcard,
              createdAt: Date.now(),
            });

            newKeys.push(city.name);
          }
        }

        previousMiles = currentMiles;
      }

      if (newPostcards.length > 0) {
        setPostcards((prev) =>
          [...newPostcards, ...prev].sort(
            (a, b) =>  b.miles - a.miles
          )
        );

        setGeneratedPostcards((prev) => {
          const next = new Set(prev);

          for (const key of newKeys) {
            next.add(key);
          }

          return next;
        });
      }
    }

    checkMilestones();
  }, [runs]);

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
        miles: parsedMiles,
        date: date, // ← new field
      })
      .select();  // ← add .select() to get the inserted row back

    if (error) {
      console.error("Supabase insert error:", error);
      alert(`Failed to add run: ${error.message}`);
    } else {
      console.log("Successfully inserted:", data);
      setName("");
      setMiles("");
      const d = new Date();
      const offset = d.getTimezoneOffset();
      const local = new Date(d.getTime() - offset * 60000);
      setDate(local.toISOString().split("T")[0]);
      // Optional: you can manually add it too as backup
      // setRuns(prev => [...prev, data[0]]);
    }
  };

  const deleteRun = async (id) => {
    const { error } = await supabase.from("runs").delete().eq("id", id);
    if (error) console.error("Failed to delete run:", error);
    setPendingDelete(null);
  };

  async function generatePostcard(city, runnerName) {
    const runner = RUNNERS[runnerName.toLowerCase().trim()];

    if (!runner) {
      console.warn("No runner image found for:", runnerName);
      return null;
    }

    try {
      const canvas = document.createElement("canvas");

      canvas.width = 1400;
      canvas.height = 800;

      const ctx = canvas.getContext("2d");

      const bg = await loadImage(city.image);
      const runnerImg = await loadImage(runner.image);

      // BACKGROUND
      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

      // DARK OVERLAY
      const gradient = ctx.createLinearGradient(
        0,
        0,
        0,
        canvas.height
      );

      gradient.addColorStop(0, "rgba(0,0,0,0.15)");
      gradient.addColorStop(1, "rgba(0,0,0,0.75)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // POSTCARD BORDER
      ctx.strokeStyle = "white";
      ctx.lineWidth = 14;
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

      // CITY TITLE
      ctx.fillStyle = "white";
      ctx.font = "bold 74px sans-serif";

      ctx.fillText(
        city.name,
        70,
        110
      );

      // SUBTITLE
      ctx.font = "36px sans-serif";

      ctx.fillText(
        `${runner.displayName} reached ${city.miles} miles`,
        70,
        170
      );

      // DATE
      ctx.font = "28px sans-serif";

      ctx.fillText(
        new Date().toLocaleDateString(),
        70,
        220
      );

      // RUNNER IMAGE
      const maxHeight = 520;

      const aspect =
        runnerImg.width / runnerImg.height;

      const runnerHeight = maxHeight;
      const runnerWidth =
        runnerHeight * aspect;

      ctx.drawImage(
        runnerImg,
        canvas.width - runnerWidth - 60,
        canvas.height - runnerHeight - 30,
        runnerWidth,
        runnerHeight
      );

      // BOTTOM LABEL
      ctx.font = "italic 30px serif";

      ctx.fillText(
        "Summer Miles 2026",
        70,
        canvas.height - 60
      );

      return canvas.toDataURL("image/png");
    } catch (err) {
      console.error("Failed to generate postcard:", err);
      return null;
    }
  }

  return (
    <div id="root">
      <div
        style={{
          padding: 20,
          maxWidth: "900px",
          margin: "0 auto", // centers it
          width: "100%",
        }}
      >
        <h2>Summer Miles 2026</h2>
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
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
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

        <div
          ref={mapContainer}
          style={{
            height: "50vh",        // responsive height
            minHeight: "400px",    // fallback
            marginTop: "20px",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        />
        <div style={{ marginTop: 20 }}>
          <div style={{ marginTop: 30 }}>
            <button
              onClick={() => setShowLog(!showLog)}
              style={{
                padding: "10px 16px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
                marginBottom: "12px",
              }}
            >
              {showLog ? "▼" : "▶"} Run Log
            </button>

            {showLog && (
              <ul
                style={{
                  paddingLeft: "20px",
                }}
              >
                {runs.map((r) => (
                  <li
                    key={r.id}
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <span>
                      ({r.date}): {r.name}: {r.miles} mi
                    </span>

                    {pendingDelete === r.id ? (
                      <>
                        <button
                          onClick={() => deleteRun(r.id)}
                        >
                          Confirm
                        </button>

                        <button
                          onClick={() =>
                            setPendingDelete(null)
                          }
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() =>
                          setPendingDelete(r.id)
                        }
                      >
                        Remove
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div style={{ marginTop: 3 }}>
            {postcards.length > 0 && (
              <button
                onClick={() =>
                  setShowPostcards(!showPostcards)
                }
                style={{
                  padding: "10px 16px",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                  marginBottom: "12px",
                }}
              >
                {showPostcards ? "▼" : "▶"} Postcards
              </button>
            )}

            {showPostcards && (
              <div>
                {postcards.length === 0 && (
                  <p>No cities reached yet.</p>
                )}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(320px, 1fr))",
                    gap: "20px",
                  }}
                >
                  {postcards.map((p, index) => (
                    <div
                      key={`${p.city}-${index}`}
                      style={{
                        background: "#111",
                        padding: "12px",
                        borderRadius: "16px",
                      }}
                    >
                      <img
                        src={p.image}
                        alt={p.city}
                        style={{
                          width: "100%",
                          borderRadius: "12px",
                        }}
                      />

                      <div
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems: "center",
                          marginTop: "10px",
                        }}
                      >
                        <div>
                          <strong>{p.city}</strong>
                          <div
                            style={{
                              fontSize: "14px",
                              opacity: 0.7,
                            }}
                          >
                            {p.runner}
                          </div>
                        </div>

                        <a
                          href={p.image}
                          download={`${p.city}-postcard.png`}
                          style={{
                            color: "#22c55e",
                          }}
                        >
                          Download
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
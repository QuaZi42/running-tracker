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
      "https://i.postimg.cc/NfjGXt7H/image.png",
  },

  ryan: {
    displayName: "Ryan",
    image:
      "https://i.postimg.cc/QNSnFZdP/image.png",
  },
  nathan: {
    displayName: "Nathan",
    image:
      "https://i.postimg.cc/TYHb0qQ1/image.png",
  },
  benjamin: {
    displayName: "Benjamin",
    image:
      "https://i.postimg.cc/R0pNRMvp/image.png",
  },
  jimmy: {
    displayName: "Jimmy",
    image:
      "https://i.postimg.cc/Y0tS9MZr/image.png",
  },
  ben_h: {
    displayName: "Ben_H",
    image:
      "https://i.postimg.cc/XqgZYvgL/image.png",
  },
  sebastian: {
    displayName: "Sebastian",
    image:
      "https://i.postimg.cc/RZnB1Z3z/image.png",
  },
};


  

const milestones = [
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
      "https://i.postimg.cc/FRzYg9G2/image.png",
  },

  {
    name: "Buffalo, NY",
    miles: 450.0,
    image:
      "https://i.postimg.cc/bvzDr0tV/image.png",
  },

  {
    name: "Cleveland, OH",
    miles: 628.1,
    image:
      "https://i.postimg.cc/KjNnHbRN/image.png",
  },
  
  {
    name: "Chicago, IL",
    miles: 961.8,
    image:
      "https://cdn.craft.cloud/101e4579-0e19-46b6-95c6-7eb27e4afc41/assets/uploads/pois/chicago-illinois-frommers.jpg?fit=cover&height=630&width=1200&s=MWfr79bwHIhjNMa-ds4td5LEsr0JeCbUBoMune808xE",
  },

  {
    name: "Des Moines, IA",
    miles: 1295.2,
    image:
      "https://i.postimg.cc/gcCkTyNL/image.png",
      // "https://i.postimg.cc/cHWr2RsB/image.png",
  },
  
  {
    name: "Omaha, NE",
    miles: 1430.9,
    image:
      "https://i.postimg.cc/zGxm51Yr/image.png",
  },

  {
    name: "Lexington, NE",
    miles: 1648.25,
    image:
      "https://i.postimg.cc/jd5dGT11/image.png",
  },

  {
    name: "Cheyenne, WY",
    miles: 1920.4,
    image:
      "https://i.postimg.cc/hvKR8Lky/image.png",
  },  

  {
    name: "Green River, WY",
    miles: 2195.1,
    image:
      "https://i.postimg.cc/c1MMHRTj/image.png",
  }, 

  {
    name: "Salt Lake City, UT",
    miles: 2355.9,
    image:
      "https://i.postimg.cc/L8jW6YY4/image.png",
  },

  {
    name: "Elko, NV",
    miles: 2584.4,
    image:
      "https://i.postimg.cc/mZcmVXNx/image.png",
  },

  {
    name: "Reno, NV",
    miles: 2876.5,
    image:
      "https://i.postimg.cc/TPVGMfWJ/image.png",
  },

  {
    name: "Ryan Zhao Memorial, CA",
    miles: 3095.47,
    image:
      "https://i.postimg.cc/MTYDhVLq/image.png",
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
      const existing = generatedPostcards;

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

      // WARM POSTCARD TONE
      ctx.fillStyle = "rgba(255, 210, 160, 0.18)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // SLIGHT FADE
      ctx.fillStyle = "rgba(120, 90, 60, 0.10)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // SOFT VIGNETTE
      const vignette = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        250,
        canvas.width / 2,
        canvas.height / 2,
        900
      );

      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(1, "rgba(0,0,0,0.28)");

      ctx.fillStyle = vignette;
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
        canvas.width - runnerWidth - 60 + 33,
        canvas.height - runnerHeight - 30 + 3,
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
    <div className="app-container">
        <h2 className="title">
          Summer Miles 2026
        </h2>

        <div className="controls">

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

        </div>

        {routeDistance && (
          <p>
            {totalMiles.toFixed(1)} / {routeDistance.toFixed(0)} miles (
            {(progress * 100).toFixed(0)}%)
          </p>
        )}

        {mapError && (
          <p className="error-text">
            Map failed to load. Check your token and WebGL support.
          </p>
        )}

        <div
          ref={mapContainer}
          className="map-container"
        />
        <div className="section">
          <div className="section-lg">
            <button
              onClick={() => setShowLog(!showLog)}
              className="toggle-btn"
            >
              {showLog ? "▼" : "▶"} Run Log
            </button>

            {showLog && (
              <ul className="run-log">
                {runs.map((r) => (
                  <li key={r.id} className="run-item">
                    <span>
                      ({r.date}): {r.name}: {r.miles} mi
                    </span>

                    {pendingDelete === r.id ? (
                      <div className="delete-actions">
                        <button onClick={() => deleteRun(r.id)}>
                          Confirm
                        </button>

                        <button
                          className="secondary-btn"
                          onClick={() => setPendingDelete(null)}
                        >
                          Cancel
                        </button>
                      </div>
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
                className="toggle-btn"
              >
                {showPostcards ? "▼" : "▶"} Postcards
              </button>
            )}

            {showPostcards && (
              <div>
                {postcards.length === 0 && (
                  <p>No cities reached yet.</p>
                )}

                <div className="postcard-grid">
                  {postcards.map((p, index) => (
                    <div
                      key={`${p.city}-${index}`}
                      className="postcard-card"
                    >
                      <img
                        src={p.image}
                        alt={p.city}
                        className="postcard-image"
                      />

                      <div className="postcard-footer">
                        <div>
                          <strong>{p.city}</strong>
                          <div className="runner-name">
                            {p.runner}
                          </div>
                        </div>

                        <a
                          href={p.image}
                          download={`${p.city}-postcard.png`}
                          className="download-link"
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
  );
}
import { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { createClient } from "@supabase/supabase-js";
import WeeklyRecapsPage from "./WeeklyRecapsPage";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const START = [-71.35375025269208, 42.459403089874165]; 
const END = [-121.91614025881732, 37.765293505678414];

const RUNNERS = {
  andrii: {
    displayName: "Andrii",
    color:  "#371380",
    image:
      "https://i.postimg.cc/NfjGXt7H/image.png",
  },
  ryan: {
    displayName: "Ryan",
    color:  "#ab0707",
    image:
      "https://i.postimg.cc/QNSnFZdP/image.png",
  },
  benjamin: {
    displayName: "Benjamin",
    color:  "#a47316",
    image:
      "https://i.postimg.cc/R0pNRMvp/image.png",
  },
  jimmy: {
    displayName: "Jimmy",
    color:  "#ffa96e",
    image:
      "https://i.postimg.cc/Y0tS9MZr/image.png",
  },
  ben_h: {
    displayName: "Ben_H",
    color:  "#f12936",
    image:
      "https://i.postimg.cc/XqgZYvgL/image.png",
  },
  sebastian: {
    displayName: "Sebastian",
    color:  "#ffa500",
    image:
      "https://i.postimg.cc/RZnB1Z3z/image.png",
  },
  artem: {
    displayName: "Artem",
    color:  "#1961a8",
    image:
      "https://i.postimg.cc/LsrF8M5f/image.png",
  },
  lucas: {
    displayName: "Lucas",
    color:  "#616791",
    image:
      "https://i.postimg.cc/W326rdh9/image.png",
  },
  boris: {
    displayName: "Boris",
    color:  "#1fb5a4",
    image:
      "https://i.postimg.cc/kXGHJmKh/image.png",
  },
  hugh: {
    displayName: "Hugh",
    color:  "#2138eb",
    image:
      "https://i.postimg.cc/jj2Qpz95/image.png",
  },
  hrs: {
    displayName: "HRS",
    color:  "#49eba7",
    image:
      "https://i.postimg.cc/g0xtVFYY/image.png",
  },
  levi: {
    displayName: "Levi",
    color:  "#008080",
    image:
      "https://i.postimg.cc/YqWL5db8/image.png",
  },
  ronan: {
    displayName: "Ronan",
    color:  "#800080",
    image:
      "https://i.postimg.cc/HkTLND3G/image.png",
  },
  ishan: {
    displayName: "Ishan",
    color:  "#0004ab",
    image:
      "https://i.postimg.cc/vBmV2Gp1/image.png",
  },
  newman: {
    displayName: "Newman",
    color:  "#da020e",
    image:
      "https://i.postimg.cc/dQpHvHRz/image.png",
  },
  cedric: {
    displayName: "Cedric",
    color:  "#0000ee",
    image:
      "https://i.postimg.cc/kMsw-FwFV/image.png",
  },
  alexander: {
    displayName: "Alexander",
    color:  "#00ee00",
    image:
      "https://i.postimg.cc/DzcbkpzM/image.png",
  },
  jeffrey: {
    displayName: "Jeffrey",
    color:  "#be7977",
    image:
      "https://i.postimg.cc/gJyB3WN2/image.png",
  },
  paul: {
    displayName: "Paul",
    color:  "#f0a1a1",
    image:
      "https://i.postimg.cc/wBcGNYn3/image.png",
  },
  andy: {
    displayName: "Andy",
    color:  "#a7e4d4",
    image:
      "https://i.postimg.cc/BvRQdfKt/image.png",
  },
  caroline: {
    displayName: "Caroline",
    color:  "#5e82d8",
    image:
      "https://i.postimg.cc/zf8s4pzB/image.png",
  },
  nicolas: {
    displayName: "Nicolas",
    color:  "#d7c743",
    image:
      "https://i.postimg.cc/TPJCsfSD/image.png",
  },
  ellie: {
    displayName: "Ellie",
    color:  "#34d8d0",
    image:
      "https://i.postimg.cc/yYdKZyp5/image.png",
  },
  avery: {
    displayName: "Avery",
    color:  "#48d087",
    image:
      "https://i.postimg.cc/kGbY80yB/image.png",
  },
};


const milestones = [
  {
    name: "Springfield, MA",
    miles: 87.8,
    image:
      "https://i.postimg.cc/pLpL8d5d/image.png",
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
      "https://i.postimg.cc/FRzYg9G2/image.png",
  },

  {
    name: "Buffalo, NY",
    miles: 450.0,
    image:
      "https://i.postimg.cc/ydNQ62ry/image.png",
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
      "https://i.postimg.cc/mZ3kJmpN/image.png",
  },

  {
    name: "Davenport, IA",
    miles: 1132.5,
    image:
      "https://i.postimg.cc/kgTtZT4j/image.png",
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
    name: "Sacramento, CA",
    miles: 3002.4,
    image:
      "https://i.postimg.cc/7P0zsQ97/image.png",
  },

  {
    name: "Ryan Zhao Memorial, CA",
    miles: 3095.47,
    image:
      "https://i.postimg.cc/MTYDhVLq/image.png",
  },
];

const imageCache = {};

function getEquivalentMiles(run) {
  return run.workout_type === "bike"
    ? run.miles / 4
    : run.miles;
}

function getRunTimestamp(run) {
  if (run.timestamp_utc) {
    return new Date(run.timestamp_utc).getTime();
  }
  return new Date(`${run.date}T${run.local_time || "00:00:00"}`).getTime();
}

function getTimeOfDayMinutes(run) {
  const timeStr = run.local_time || "00:00";
  const [hours, minutes] = timeStr.split(":").map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

const LOG_SORT_OPTIONS = [
  { value: "datetime", label: "Time" },
  { value: "distance", label: "Miles" },
  { value: "equivalent", label: "Eq mi" },
  { value: "timeofday", label: "Time of Day" },
];

const LOG_SORT_DEFAULT_DIR = {
  datetime: "desc",
  distance: "desc",
  equivalent: "desc",
  timeofday: "asc",
};

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

function SegmentedControl({
  value,
  onChange,
  options,
  ariaLabel,
  className = "",
}) {
  return (
    <div
      className={`segmented-control ${className}`.trim()}
      role="group"
      aria-label={ariaLabel}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`segmented-control__btn${value === opt.value ? " is-active" : ""}`}
          aria-pressed={value === opt.value}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function RunningProgressTracker() {
  const [page, setPage] = useState("tracker");

  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  
  const [runs, setRuns] = useState([]);
  const [name, setName] = useState("");
  const [miles, setMiles] = useState("");
  const [workoutType, setWorkoutType] = useState("run");
  const [logFilter, setLogFilter] = useState("all");
  const [logNameFilter, setLogNameFilter] = useState("");
  const [logSort, setLogSort] = useState("datetime");
  const [logSortDir, setLogSortDir] = useState("desc");

  const [postcards, setPostcards] = useState([]);
  const [generatedPostcards, setGeneratedPostcards] = useState(new Set());
  const [monoGreen, setMonoGreen] = useState(true);

  const [showLog, setShowLog] = useState(false);
  const [showPostcards, setShowPostcards] = useState(false);

  const [date, setDate] = useState(() => {
    const d = new Date();
    const offset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - offset * 60000);
    return local.toISOString().split("T")[0];
  });

  const [time, setTime] = useState(() => new Date().toTimeString().slice(0, 5));

  const [route, setRoute] = useState(null);
  const [routeDistance, setRouteDistance] = useState(null);
  const [mapError, setMapError] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  
  const generatingRef = useRef(new Set());

  const totalMiles = useMemo(
    () =>
      runs.reduce(
        (sum, r) => sum + getEquivalentMiles(r),
        0
      ),
    [runs]
  );
  const progress = routeDistance ? Math.min(totalMiles / routeDistance, 1) : 0;

  const filteredRuns = useMemo(() => {
    const nameQuery = logNameFilter.trim().toLowerCase();

    const filtered = runs.filter((r) => {
      if (logFilter !== "all" && r.workout_type !== logFilter) return false;
      if (
        nameQuery &&
        !r.name.toLowerCase().includes(nameQuery)
      ) {
        return false;
      }
      return true;
    });

    const dir = logSortDir === "asc" ? 1 : -1;

    return filtered.sort((a, b) => {
      let cmp = 0;

      switch (logSort) {
        case "datetime":
          cmp = getRunTimestamp(a) - getRunTimestamp(b);
          break;
        case "distance":
          cmp = a.miles - b.miles;
          break;
        case "equivalent":
          cmp = getEquivalentMiles(a) - getEquivalentMiles(b);
          break;
        case "timeofday":
          cmp = getTimeOfDayMinutes(a) - getTimeOfDayMinutes(b);
          break;
        default:
          cmp = 0;
      }

      return cmp * dir;
    });
  }, [runs, logFilter, logNameFilter, logSort, logSortDir]);

  const handleLogSortChange = (sort) => {
    setLogSort(sort);
    setLogSortDir(LOG_SORT_DEFAULT_DIR[sort] ?? "desc");
  };

  // Fetch runs + real-time subscription
  useEffect(() => {
    supabase
      .from("runs")
      .select("*, timestamp_utc, local_time, timezone")
      .order("timestamp_utc", { ascending: true })   // ← Best sorting
      .then(({ data, error }) => {
        if (error) console.error("Failed to fetch runs:", error);
        else setRuns(data || []);
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
                (a, b) =>
                  new Date(`${a.date}T${a.time || "00:00:00"}`) -
                  new Date(`${b.date}T${b.time || "00:00:00"}`)
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

  // Map setup
  useEffect(() => {
    // Cleanup previous map
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
      markerRef.current = null;
    }

    if (page !== "tracker") return;

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
            geometry: { type: "LineString", coordinates: routeData.geometry.coordinates },
          },
        });

        map.addLayer({
          id: "route",
          type: "line",
          source: "route",
          paint: { "line-width": 5 },
        });

        Object.keys(RUNNERS).forEach((runnerKey) => {
          map.addSource(`progress-${runnerKey}`, {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [],
              },
            },
          });

          map.addLayer({
            id: `progress-line-${runnerKey}`,
            type: "line",
            source: `progress-${runnerKey}`,
            paint: {
              "line-width": 6,
              "line-color": monoGreen
                ? "#1e9c17"
                : RUNNERS[runnerKey]?.color || "#000000",
              "line-cap": "round",
              "line-opacity": 0.85,
            },
          });
        });

        markerRef.current = new mapboxgl.Marker().setLngLat(START).addTo(map);
      } catch (e) {
        console.error("Failed to load route:", e);
        setMapError(true);
      }
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [page]);

  // Update marker + progress line
  useEffect(() => {
  if (!route || !routeDistance || !mapRef.current) return;

  // Build cumulative distances along route
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

  function getRunnerKey(name) {
      const key = name.toLowerCase().trim();
      return RUNNERS[key] ? key : "unknown";
    }

    // Build ordered segments directly from runs
  const orderedSegments = runs.map((run) => ({
    runnerKey: getRunnerKey(run.name),
    miles: getEquivalentMiles(run),
  }));

  // Draw each run as a continuous segment
  let cumulativeStart = 0;

  // Store all segments per runner
  const runnerCoords = {};

  orderedSegments.forEach(({ runnerKey, miles }) => {
    const startMiles = cumulativeStart;
    const endMiles = cumulativeStart + miles;

    cumulativeStart = endMiles;

    const startDist =
      (Math.min(startMiles, routeDistance) / routeDistance) *
      totalRouteMiles;

    const endDist =
      (Math.min(endMiles, routeDistance) / routeDistance) *
      totalRouteMiles;

    function getPointAtDistance(targetDist) {
      let i = 0;

      while (
        i < cumulative.length - 1 &&
        cumulative[i + 1] < targetDist
      ) {
        i++;
      }

      const segLen = cumulative[i + 1] - cumulative[i];

      const t =
        segLen > 0
          ? (targetDist - cumulative[i]) / segLen
          : 0;

      const a = route[i];
      const b = route[Math.min(i + 1, route.length - 1)];

      return {
        index: i,
        point: [
          a[0] + (b[0] - a[0]) * t,
          a[1] + (b[1] - a[1]) * t,
        ],
      };
    }

    const startData = getPointAtDistance(startDist);
    const endData = getPointAtDistance(endDist);

    const progressCoords = [
      startData.point,
      ...route.slice(startData.index + 1, endData.index + 1),
      endData.point,
    ];

    // Initialize runner array
    if (!runnerCoords[runnerKey]) {
      runnerCoords[runnerKey] = [];
    }

    // Append segment
    runnerCoords[runnerKey].push(progressCoords);
  });

  // After all runs processed, update map sources
  Object.entries(runnerCoords).forEach(([runnerKey, coords]) => {
    const source = mapRef.current.getSource(`progress-${runnerKey}`);

    if (source) {
      source.setData({
        type: "Feature",
        geometry: {
          type: "MultiLineString",
          coordinates: coords,
        },
      });
    }
  });
  Object.keys(RUNNERS).forEach((runnerKey) => {
    if (!runnerCoords[runnerKey]) {
      const source = mapRef.current.getSource(`progress-${runnerKey}`);

      if (source) {
        source.setData({
          type: "Feature",
          geometry: {
            type: "MultiLineString",
            coordinates: [],
          },
        });
      }
    }
  });
  Object.keys(RUNNERS).forEach((runnerKey) => {
    if (mapRef.current.getLayer(`progress-line-${runnerKey}`)) {
      mapRef.current.setPaintProperty(
        `progress-line-${runnerKey}`,
        "line-color",
        monoGreen
          ? "#1e9c17"
          : RUNNERS[runnerKey]?.color || "#000000"
      );
    }
  });
    // Overall marker still uses total group miles
  if (markerRef.current) {
    const totalMiles = runs.reduce(
      (s, r) => s + getEquivalentMiles(r),
      0
    );

    const targetMiles = Math.min(totalMiles, routeDistance);

    const targetDist =
      (targetMiles / routeDistance) * totalRouteMiles;

    let i = 0;

    while (
      i < cumulative.length - 1 &&
      cumulative[i + 1] < targetDist
    ) {
      i++;
    }

    const segLen = cumulative[i + 1] - cumulative[i];

    const t =
      segLen > 0
        ? (targetDist - cumulative[i]) / segLen
        : 0;

    const a = route[i];
    const b = route[Math.min(i + 1, route.length - 1)];

    markerRef.current.setLngLat([
      a[0] + (b[0] - a[0]) * t,
      a[1] + (b[1] - a[1]) * t,
    ]);
  }
}, [runs, route, routeDistance, monoGreen]);
  // Milestone postcards
// Keep this ref at the top level of your component
const processedMilestonesRef = useRef(new Set());

useEffect(() => {
  async function checkMilestones() {
    const newPostcards = [];
    let currentTotal = 0;

    // Use a local set for this specific execution to prevent internal duplicates
    const batchSeen = new Set();

    for (const run of runs) {
      currentTotal += getEquivalentMiles(run);

      for (const city of milestones) {
        const crossed = currentTotal >= city.miles;
        
        // Check BOTH the global ref and the local batch set
        if (crossed && !processedMilestonesRef.current.has(city.name) && !batchSeen.has(city.name)) {
          
          // LOCK it immediately before starting the async canvas work
          batchSeen.add(city.name);
          processedMilestonesRef.current.add(city.name);

          const postcardImg = await generatePostcard(city, run.name);
          
          if (postcardImg) {
            newPostcards.push({
              city: city.name,
              miles: city.miles,
              runner: run.name,
              image: postcardImg,
              createdAt: Date.now(),
            });
          }
        }
      }
    }

    if (newPostcards.length > 0) {
      setPostcards((prev) => {
        // Create a map of existing postcards indexed by city name
        const combined = [...newPostcards, ...prev];
        const uniqueMap = new Map();
        
        // Only keep the first instance of any city found
        combined.forEach(p => {
          if (!uniqueMap.has(p.city)) {
            uniqueMap.set(p.city, p);
          }
        });

        return Array.from(uniqueMap.values()).sort((a, b) => b.miles - a.miles);
      });
    }
  }

  checkMilestones();
  }, [runs]);

  const getUserTimezone = () => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  };

  const getTimezoneAbbr = (tz) => {
    try {
      return new Intl.DateTimeFormat('en', { 
        timeZone: tz, 
        timeZoneName: 'short' 
      }).formatToParts(new Date())
      .find(p => p.type === 'timeZoneName')?.value || tz;
    } catch {
      return tz;
    }
  };

  const addRun = async () => {
    const parsedMiles = parseFloat(miles);
    if (!name?.trim() || isNaN(parsedMiles) || parsedMiles <= 0) {
      alert("Please enter valid name and miles");
      return;
    }

    const localDateTime = `${date}T${time}`;
    const dateObj = new Date(localDateTime);           // interpreted in user's local TZ
    const timestampUtc = dateObj.toISOString();
    

    const { data, error } = await supabase
      .from("runs")
      .insert({
        name: name.trim(),
        miles: parsedMiles,
        workout_type: workoutType,
        date: date,                    // keep for now
        local_time: time,
        timezone: getUserTimezone(),
        timestamp_utc: timestampUtc,
      })
      .select();

    if (error) {
      console.error(error);
      alert("Failed to add run");
    } else {
      setName("");
      setMiles("");
      // reset to current local date/time
      const now = new Date();
      setDate(now.toISOString().split("T")[0]);
      setTime(now.toTimeString().slice(0, 5));
    }
  };

  const deleteRun = async (id) => {
    const { error } = await supabase.from("runs").delete().eq("id", id);
    
    if (!error) {
      // 1. Clear the "already processed" memory
      processedMilestonesRef.current.clear();
      // 2. Wipe the postcards so they are re-generated based on remaining runs
      setPostcards([]);
      setPendingDelete(null);
    } else {
      console.error("Failed to delete run:", error);
    }
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
  
  useEffect(() => {
    if (page === "tracker" && mapRef.current === null) {
      // Small delay to let DOM settle
      const timer = setTimeout(() => {
        // Force re-init if needed (you can also just rely on the existing effect)
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [page]);

  
 return (
    <div className="app-container">
      {page === "tracker" ? (
        <>
          <div className="page-header">
            <h2 className="title page-title">Summer Miles 2026</h2>

            <div className="page-header-actions">
              <button type="button" onClick={() => setPage("recaps")}>
                📊 Weekly Recaps
              </button>

              <button
                type="button"
                onClick={() => setMonoGreen((v) => !v)}
              >
                {monoGreen ? "🟢 All Green" : "🎨 Normal Colors"}
              </button>
            </div>
          </div>

          <div className="controls">
            <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input placeholder="Miles" type="number" value={miles} onChange={(e) => setMiles(e.target.value)} />
            <SegmentedControl
              ariaLabel="Workout type"
              value={workoutType}
              onChange={setWorkoutType}
              options={[
                { value: "run", label: "🏃 Run" },
                { value: "bike", label: "🚴 Bike" },
              ]}
            />
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            <button onClick={addRun} disabled={!routeDistance}>Add</button>
          </div>

          {routeDistance && (
            <p className="progress-text">
              {totalMiles.toFixed(1)} / {routeDistance.toFixed(0)} miles ({(progress * 100).toFixed(0)}%)
            </p>
          )}

          {mapError && <p className="error-text">Oops something went wrong! Refresh the page and if the problem persists, contact Andrii.</p>}

          <div ref={mapContainer} className="map-container" />

          <div className="legend">
            {Object.entries(RUNNERS).map(([key, runner]) => (
              <div key={key} className="legend-item">
                <div
                  className="legend-color"
                  style={{ background: RUNNERS[key]?.color }}
                />
                {runner.displayName}
              </div>
            ))}
          </div>

          <div className="section">
            <div className="section-lg">
              <button onClick={() => setShowLog(!showLog)} className="toggle-btn">
                {showLog ? "▼" : "▶"} Run Log
              </button>

              {showLog && (
                <ul className="run-log">
                  <li className="run-log-filter">
                    <div className="run-log-toolbar">
                      <span className="run-log-toolbar-label">Filter</span>
                      <SegmentedControl
                        ariaLabel="Filter run log"
                        value={logFilter}
                        onChange={setLogFilter}
                        options={[
                          { value: "all", label: "All" },
                          { value: "run", label: "Runs" },
                          { value: "bike", label: "Bike Rides" },
                        ]}
                      />
                    </div>
                    <div className="run-log-toolbar">
                      <span className="run-log-toolbar-label">Name</span>
                      <input
                        type="search"
                        className="run-log-name-filter"
                        placeholder="Filter by name…"
                        value={logNameFilter}
                        onChange={(e) => setLogNameFilter(e.target.value)}
                        aria-label="Filter run log by name"
                      />
                    </div>
                    <div className="run-log-toolbar">
                      <span className="run-log-toolbar-label">Sort</span>
                      <SegmentedControl
                        className="segmented-control--wrap"
                        ariaLabel="Sort run log"
                        value={logSort}
                        onChange={handleLogSortChange}
                        options={LOG_SORT_OPTIONS}
                      />
                      <button
                        type="button"
                        className="sort-dir-btn secondary-btn"
                        onClick={() =>
                          setLogSortDir((d) => (d === "asc" ? "desc" : "asc"))
                        }
                        title={
                          logSortDir === "asc"
                            ? "Ascending — click to reverse"
                            : "Descending — click to reverse"
                        }
                      >
                        {logSortDir === "asc" ? "↑ Asc" : "↓ Desc"}
                      </button>
                    </div>
                  </li>

                  {filteredRuns.map((r) => (
                    <li key={r.id} className="run-item">
                      <span className="run-item-details">
                        <>
                          {r.local_time
                            ? `${r.date} ${r.local_time} (${getTimezoneAbbr(r.timezone)})`
                            : r.date}
                          {" • "}
                          {r.name}
                          {" • "}

                          {r.workout_type === "bike" ? (
                            <>
                              🚴 Bike:
                              {" "}
                              {r.miles} mi
                              {" → "}
                              {getEquivalentMiles(r).toFixed(1)}
                              {" eq mi"}
                            </>
                          ) : (
                            <>
                              🏃 Run:
                              {" "}
                              {r.miles} mi
                            </>
                          )}
                        </>
                      </span>
                      {pendingDelete === r.id ? (
                        <div className="delete-actions">
                          <button onClick={() => deleteRun(r.id)}>Confirm</button>
                          <button className="secondary-btn" onClick={() => setPendingDelete(null)}>Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => setPendingDelete(r.id)}>Remove</button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div style={{ marginTop: 3 }}>
              {postcards.length > 0 && (
                <button onClick={() => setShowPostcards(!showPostcards)} className="toggle-btn">
                  {showPostcards ? "▼" : "▶"} Postcards
                </button>
              )}

              {showPostcards && (
                <div>
                  {postcards.length === 0 && <p>No cities reached yet.</p>}
                  <div className="postcard-grid">
                    {postcards.map((p, index) => (
                      <div key={`${p.city}-${index}`} className="postcard-card">
                        <img src={p.image} alt={p.city} className="postcard-image" />
                        <div className="postcard-footer">
                          <div>
                            <strong>{p.city}</strong>
                            <div className="runner-name">{p.runner}</div>
                          </div>
                          <a href={p.image} download={`${p.city}-postcard.png`} className="download-link">
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
          <footer className="app-footer">
            <div className="app-footer-brand">
              <strong>Summer Miles 2026</strong>
              <span className="app-footer-version">v1.2.3</span>
            </div>

            <div className="app-footer-meta">
              <span>Developed by Andrii Vedmid</span>
              <span>Map Data © Mapbox</span>
              <span>Powered by Supabase</span>
            </div>
          </footer>
        </>
      ) : (
        <WeeklyRecapsPage onBack={() => setPage("tracker")} />
      )}
    </div>
  );
}
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
    color:  "#ee00ee",
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
  john: {
    displayName: "John",
    color:  "#c329e5",
    image:
      "https://i.postimg.cc/FK6gMd1D/image.png",
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
    name: "Gary, IN",
    miles: 951,
    image:
      "https://i.postimg.cc/KjW5219g/Whats-App-Image-2026-06-28-at-22-12-50.jpg",
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
    name: "Ryan Zhao House, CA",
    miles: 3095.47,
    image:
      "https://i.postimg.cc/MTYDhVLq/image.png",
  },
];

const imageCache = {};
const imageLoadPromises = {};
const postcardCache = {};
const POSTCARDS_STORAGE_KEY = "summer-miles-2026-postcards";

function loadStoredPostcards() {
  try {
    const raw = localStorage.getItem(POSTCARDS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveStoredPostcards(postcards) {
  try {
    localStorage.setItem(POSTCARDS_STORAGE_KEY, JSON.stringify(postcards));
  } catch (err) {
    console.warn("Could not persist postcards:", err);
  }
}

function computeMilestonesToGenerate(runs, existingCities) {
  let currentTotal = 0;
  const pending = [];

  for (const run of runs) {
    currentTotal += getEquivalentMiles(run);

    for (const city of milestones) {
      if (
        currentTotal >= city.miles &&
        !existingCities.has(city.name) &&
        !pending.some((item) => item.city.name === city.name)
      ) {
        pending.push({
          city,
          runner: city.name === "Gary, IN" ? "Sebastian" : run.name,
          date: run.date,
        });
      }
    }
  }

  return pending;
}

async function loadImage(url, timeoutMs = 12000) {
  if (imageCache[url]) return imageCache[url];
  if (imageLoadPromises[url]) return imageLoadPromises[url];

  imageLoadPromises[url] = new Promise((resolve, reject) => {
    const img = new Image();
    let settled = false;

    const finish = (fn, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      fn(value);
    };

    const timer = setTimeout(() => {
      finish(reject, new Error(`Timed out loading image: ${url}`));
    }, timeoutMs);

    img.onload = () => {
      imageCache[url] = img;
      finish(resolve, img);
    };

    img.onerror = () => {
      finish(reject, new Error(`Failed to load image: ${url}`));
    };

    img.crossOrigin = "anonymous";
    img.src = url;
  }).finally(() => {
    delete imageLoadPromises[url];
  });

  return imageLoadPromises[url];
}

function preloadPostcardImages() {
  const urls = new Set([
    ...milestones.map((city) => city.image),
    ...Object.values(RUNNERS).map((runner) => runner.image),
  ]);

  urls.forEach((url) => {
    loadImage(url).catch(() => {});
  });
}

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

function coordsEqual(a, b, eps = 1e-8) {
  return Math.abs(a[0] - b[0]) < eps && Math.abs(a[1] - b[1]) < eps;
}

function appendRunnerSegment(segments, newCoords) {
  if (newCoords.length < 2) return;

  const lastSegment = segments[segments.length - 1];

  if (
    lastSegment &&
    coordsEqual(lastSegment[lastSegment.length - 1], newCoords[0])
  ) {
    lastSegment.push(...newCoords.slice(1));
    return;
  }

  segments.push(newCoords);
}

function getDateInputBounds() {
  const today = new Date();
  const maxDate = today.toISOString().split("T")[0];
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const minDate = yesterday.toISOString().split("T")[0];
  return { minDate, maxDate };
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
  
  const [showPlaceFinder, setShowPlaceFinder] = useState(false);
  const [searchPlace, setSearchPlace] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const [postcards, setPostcards] = useState(() => loadStoredPostcards());
  const [postcardsLoading, setPostcardsLoading] = useState(false);
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
  
  const processedMilestonesRef = useRef(
    new Set(loadStoredPostcards().map((postcard) => postcard.city))
  );
  const postcardGenerationRef = useRef(0);

  useEffect(() => {
    preloadPostcardImages();
  }, []);

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

  const { minDate, maxDate } = getDateInputBounds();

  const prediction = useMemo(() => {
    if (!routeDistance || runs.length === 0) return null;

    const sortedRuns = [...runs].sort(
      (a, b) => getRunTimestamp(a) - getRunTimestamp(b)
    );

    const firstRunDate = new Date(sortedRuns[0].date);
    const today = new Date();

    const elapsedDays = Math.max(
      1,
      Math.ceil((today - firstRunDate) / (1000 * 60 * 60 * 24))
    );

    const avgMilesPerDay = totalMiles / elapsedDays;

    if (avgMilesPerDay <= 0) return null;

    const remainingMiles = routeDistance - totalMiles;

    const daysToFinish = Math.max(
      0,
      remainingMiles / avgMilesPerDay
    );

    const projectedArrival = new Date();
    projectedArrival.setDate(
      projectedArrival.getDate() + Math.ceil(daysToFinish)
    );

    const aug31 = new Date("2026-08-31T23:59:59");

    const arrivesBeforeDeadline =
      projectedArrival <= aug31;

    let projectedMilesByAug31 = null;

    if (!arrivesBeforeDeadline) {
      const daysUntilAug31 = Math.max(
        0,
        (aug31 - today) / (1000 * 60 * 60 * 24)
      );

      projectedMilesByAug31 =
        totalMiles + avgMilesPerDay * daysUntilAug31;
    }

    return {
      avgMilesPerDay,
      projectedArrival,
      arrivesBeforeDeadline,
      projectedMilesByAug31,
    };
  }, [runs, totalMiles, routeDistance]);

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
          paint: {
            "line-width": 4,
            "line-color": "#64748b",
            "line-opacity": 0.9,
          },
        });

        map.addSource("progress-cumulative", {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: { type: "LineString", coordinates: [] },
          },
        });

        map.addLayer({
          id: "progress-cumulative",
          type: "line",
          source: "progress-cumulative",
          paint: {
            "line-width": 6,
            "line-color": "#1e9c17",
            "line-opacity": 1,
            "line-cap": "round",
            "line-join": "round",
          },
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
              "line-cap": "butt",
              "line-join": "round",
              "line-opacity": 1,
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

    appendRunnerSegment(runnerCoords[runnerKey], progressCoords);
  });

  const totalProgressCoords = (() => {
    if (orderedSegments.length === 0) return [];

    const totalMilesForLine = orderedSegments.reduce(
      (sum, seg) => sum + seg.miles,
      0
    );
    const endDist =
      (Math.min(totalMilesForLine, routeDistance) / routeDistance) *
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
        segLen > 0 ? (targetDist - cumulative[i]) / segLen : 0;
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

    const endData = getPointAtDistance(endDist);
    return [
      route[0],
      ...route.slice(1, endData.index + 1),
      endData.point,
    ];
  })();

  const cumulativeSource = mapRef.current.getSource("progress-cumulative");
  if (cumulativeSource) {
    cumulativeSource.setData({
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: totalProgressCoords,
      },
    });
  }

  if (mapRef.current.getLayer("progress-cumulative")) {
    mapRef.current.setPaintProperty(
      "progress-cumulative",
      "line-color",
      monoGreen ? "#1e9c17" : "#334155"
    );
    mapRef.current.setLayoutProperty(
      "progress-cumulative",
      "visibility",
      totalProgressCoords.length > 1 ? "visible" : "none"
    );
  }

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
    const layerId = `progress-line-${runnerKey}`;
    if (!mapRef.current.getLayer(layerId)) return;

    mapRef.current.setPaintProperty(
      layerId,
      "line-color",
      monoGreen
        ? "#1e9c17"
        : RUNNERS[runnerKey]?.color || "#000000"
    );
    mapRef.current.setLayoutProperty(
      layerId,
      "visibility",
      monoGreen ? "none" : "visible"
    );
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
  useEffect(() => {
    if (runs.length === 0) return;

    const generationId = ++postcardGenerationRef.current;

    async function checkMilestones() {
      const existingCities = new Set([
        ...postcards.map((postcard) => postcard.city),
        ...processedMilestonesRef.current,
      ]);

      const pending = computeMilestonesToGenerate(runs, existingCities);
      if (pending.length === 0) return;

      setPostcardsLoading(true);

      const results = await Promise.all(
        pending.map(async (item) => {
          const image = await generatePostcard(item.city, item.runner, item.date);
          return image ? { ...item, image } : null;
        })
      );

      if (generationId !== postcardGenerationRef.current) return;

      const generated = results.filter(Boolean);
      if (generated.length === 0) {
        setPostcardsLoading(false);
        return;
      }

      generated.forEach((item) => {
        processedMilestonesRef.current.add(item.city.name);
      });

      setPostcards((prev) => {
        const uniqueMap = new Map(prev.map((postcard) => [postcard.city, postcard]));

        generated.forEach((item) => {
          uniqueMap.set(item.city.name, {
            city: item.city.name,
            miles: item.city.miles,
            runner: item.runner,
            image: item.image,
            createdAt: Date.now(),
          });
        });

        const next = Array.from(uniqueMap.values()).sort(
          (a, b) => b.miles - a.miles
        );
        saveStoredPostcards(next);
        return next;
      });

      setPostcardsLoading(false);
    }

    checkMilestones().catch((err) => {
      console.error("Postcard generation failed:", err);
      if (generationId === postcardGenerationRef.current) {
        setPostcardsLoading(false);
      }
    });
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
      postcardGenerationRef.current += 1;
      Object.keys(postcardCache).forEach((key) => delete postcardCache[key]);
      localStorage.removeItem(POSTCARDS_STORAGE_KEY);
      setPostcards([]);
      setPendingDelete(null);
    } else {
      console.error("Failed to delete run:", error);
    }
  };

  async function findPlace() {
    if (!searchPlace.trim() || !route || !routeDistance) return;

    const token = import.meta.env.VITE_MAPBOX_TOKEN;

    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        searchPlace
      )}.json?limit=1&access_token=${token}`
    );

    const data = await res.json();

    if (!data.features?.length) {
      alert("Place not found.");
      return;
    }

    const point = data.features[0].center;

    // Find nearest point on the route
    let bestIndex = 0;
    let bestDist = Infinity;

    for (let i = 0; i < route.length; i++) {
      const dx = route[i][0] - point[0];
      const dy = route[i][1] - point[1];
      const d = dx * dx + dy * dy;

      if (d < bestDist) {
        bestDist = d;
        bestIndex = i;
      }
    }

    // Measure miles along route to that point
    let miles = 0;

    for (let i = 1; i <= bestIndex; i++) {
      const [lng1, lat1] = route[i - 1];
      const [lng2, lat2] = route[i];

      const dlng = (lng2 - lng1) * Math.cos((lat1 * Math.PI) / 180);
      const dlat = lat2 - lat1;

      miles += Math.sqrt(dlng * dlng + dlat * dlat) * 69.11;
    }

    setSearchResult({
      name: data.features[0].place_name,
      miles,
      coords: point,
    });

    if (mapRef.current) {
      if (window.searchMarker) window.searchMarker.remove();

      window.searchMarker = new mapboxgl.Marker({ color: "#0066ff" })
        .setLngLat(point)
        .addTo(mapRef.current);

      mapRef.current.flyTo({
        center: point,
        zoom: 6,
      });
    }
  }

  async function generatePostcard(city, runnerName, runDate) {
    if (postcardCache[city.name]) return postcardCache[city.name];

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
        runDate
          ? new Date(`${runDate}T12:00:00`).toLocaleDateString()
          : new Date().toLocaleDateString(),
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

      const dataUrl = canvas.toDataURL("image/png");
      postcardCache[city.name] = dataUrl;
      return dataUrl;
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
              {/*
              <button type="button" onClick={() => setPage("recaps")}>
                📊 Weekly Recaps
              </button>
              */}

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
            <div className="controls-datetime">
              <input
                type="date"
                value={date}
                min={minDate}
                max={maxDate}
                onChange={(e) => setDate(e.target.value)}
              />
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
            <button onClick={addRun} disabled={!routeDistance}>Add</button>
          </div>

          {routeDistance && (
            <p className="progress-text">
              {totalMiles.toFixed(1)} / {routeDistance.toFixed(0)} miles ({(progress * 100).toFixed(0)}%)
            </p>
          )}
          {prediction && (
            <div className="prediction-box">
              <p>
                Current pace:{" "}
                <strong>
                  {prediction.avgMilesPerDay.toFixed(1)}
                </strong>{" "}
                eq mi/day
              </p>

              {prediction.arrivesBeforeDeadline ? (
                <p>
                  Predicted arrival:{" "}
                  <strong>
                    {prediction.projectedArrival.toLocaleDateString()}
                  </strong>
                </p>
              ) : (
                <p>
                  Predicted arrival:{" "}
                  <strong>
                    {prediction.projectedArrival.toLocaleDateString()}
                  </strong>
                  <br />
                  By August 31, projected distance:{" "}
                  <strong>
                    {prediction.projectedMilesByAug31.toFixed(0)}
                  </strong>
                  {" / "}
                  {routeDistance.toFixed(0)} miles
                  {" ("}
                  {(
                    (prediction.projectedMilesByAug31 /
                      routeDistance) *
                    100
                  ).toFixed(0)}
                  %)
                </p>
              )}
            </div>
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
              {(postcards.length > 0 || postcardsLoading) && (
                <button onClick={() => setShowPostcards(!showPostcards)} className="toggle-btn">
                  {showPostcards ? "▼" : "▶"} Postcards
                  {postcardsLoading ? " (generating…)" : ""}
                </button>
              )}

              {showPostcards && (
                <div>
                  {postcardsLoading && postcards.length === 0 && (
                    <p className="postcards-status">Generating postcards…</p>
                  )}
                  {!postcardsLoading && postcards.length === 0 && (
                    <p>No cities reached yet.</p>
                  )}
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
              
            <div style={{ marginTop: 3 }}>
              <button
                onClick={() => setShowPlaceFinder(!showPlaceFinder)}
                className="toggle-btn"
              >
                {showPlaceFinder ? "▼" : "▶"} Place Finder
              </button>

              {showPlaceFinder && (
                <div className="controls">
                  <input
                    placeholder="Search city..."
                    value={searchPlace}
                    onChange={(e) => setSearchPlace(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") findPlace();
                    }}
                  />
                  <button onClick={findPlace}>Find</button>

                  {searchResult && (
                    <p className="progress-text">
                      <strong>{searchResult.name}</strong>
                      <br />
                      {searchResult.miles.toFixed(0)} miles from the start.
                      <br />
                      {totalMiles >= searchResult.miles
                        ? "✅ Already passed!"
                        : `${(searchResult.miles - totalMiles).toFixed(1)} miles remaining`}
                    </p>
                  )}
                </div>
              )}
            </div>

          </div>
          <footer className="app-footer">
            <div className="app-footer-brand">
              <strong>Summer Miles 2026</strong>
              <span className="app-footer-version">v1.5.1</span>
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
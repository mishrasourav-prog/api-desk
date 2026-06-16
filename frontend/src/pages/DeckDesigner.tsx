import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { HttpMethod, HttpStatus } from "../types/deck";
import EndpointForm from "../components/designer/EndpointForm";
import CodeEditor from "../components/shared/CodeEditor";
import LogStream from "../components/designer/LogStream";
import api from "../config/axiosInstance.Config";


const DEFAULT_BODY = JSON.stringify(
  {
    message: "Hello from API-Deck!",
    success: true,
  },
  null,
  2
);

export default function DeckDesigner() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [path, setPath] = useState("");
  const [method, setMethod] = useState<HttpMethod>("GET");
  const [status, setStatus] = useState<HttpStatus>(200);
  const [body, setBody] = useState(DEFAULT_BODY);
  const [description, setDescription] = useState("");

  // ---------------- EDIT MODE ----------------
  useEffect(() => {
    if (!id) return;

    const fetchDeck = async () => {
      try {
        const response = await api.get(`/deck/${id}`);
        console.log("FULL RESPONSE:", response.data);
        const deck = response.data.data.deck;

        setPath(deck.path);
        setMethod(deck.method);
        setStatus(deck.responseStatus);
        setBody(deck.responseBody);
        setDescription(deck.description || "");
      } catch (err) {
        console.error(err);
      }
    };

    fetchDeck();
  }, [id]);

  // ---------------- JSON VALIDATION ----------------
  function isValidJson(str: string) {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  }

  // ---------------- SAVE / UPDATE ----------------
async function handleSave() {
    console.log("FINAL DESCRIPTION:", description);
    console.log("SENDING PAYLOAD:", {
  path,
  method,
  status,
  body,
  description
});
  if (!path.trim()) {
    alert("Please provide a valid path.");
    return;
  }

  if (!isValidJson(body)) {
    alert("Invalid JSON.");
    return;
  }
  const sanitizedPath = path.trim().replace(/\/+/g, '/');

  const finalDescriptionText = String(description || "").trim();

  try {
    if (id) {
      // EDIT existing deck
      await api.put(`/deck/${id}`, {
        path: sanitizedPath.trim(),
        method,
        responseStatus: Number(status),
        responseBody: body,
        description: finalDescriptionText,
      });
    } else {
      // CREATE new deck
      await api.post("/deck/create", {
        path: sanitizedPath.trim(),
        method,
        responseStatus: Number(status),
        responseBody: body,
        description: finalDescriptionText,
      });
    }

    navigate("/app/dashboard");
  } catch (err) {
    console.error(err);
  }
}

  return (
    <div className="flex flex-col h-full min-h-0">

      {/* Header */}
      <div className="px-6 py-4 border-b border-[#30363d] flex justify-between">
        <div>
          <h1 className="text-[#f0f6fc] font-bold text-lg">
            {id ? "Edit Mock Endpoint" : "New Mock Endpoint"}
          </h1>

          <p className="text-[#8b949e] text-xs mt-0.5">
            {id
              ? "Update existing endpoint"
              : "Configure a new mock endpoint"}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate("/app/dashboard")}
            className="px-4 py-2 border text-sm rounded-md text-[#8b949e]"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#238636] text-white text-sm rounded-md"
          >
            {id ? "Update" : "Save"}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1">

        <div className="w-[45%] border-r border-[#30363d] p-5">
          <EndpointForm
            path={path}
            method={method}
            status={status}
            description={description}
            onPathChange={setPath}
            onMethodChange={setMethod}
            onStatusChange={setStatus}
            onDescriptionChange={setDescription}
          />

          <div className="mt-5">
            <CodeEditor value={body} onChange={setBody} />
          </div>
        </div>

        <div className="flex-1 bg-[#0d1117]">
          <LogStream
            endpointPath={path || "new"}
            method={method}
            initialLogs={[]}
          />
        </div>

      </div>
    </div>
  );
}
/**
 * Byzant MCP HTTP endpoint — Next.js/Vercel implementation.
 *
 * Available tools:
 *
 * 1. get_whale_flow
 *    Description: Retrieve unusual options flow and whale activity from Byzant's live feed
 *    Parameters:
 *      - ticker?: string — filter by ticker symbol
 *      - sentiment?: "bullish" | "bearish" — filter by sentiment
 *      - limit?: number — max records to return, default 50, max 200
 *
 * 2. get_congressional_trades
 *    Description: Retrieve recent congressional stock trade disclosures
 *    Parameters:
 *      - politician?: string — filter by politician name
 *      - party?: "Democrat" | "Republican" — filter by party
 *      - ticker?: string — filter by ticker symbol
 *      - limit?: number — max records to return, default 50, max 200
 *
 * Example curl commands:
 *
 * curl -X POST https://byzant.ai/api/mcp \
 *   -H "Content-Type: application/json" \
 *   -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
 *
 * curl -X POST https://byzant.ai/api/mcp \
 *   -H "Content-Type: application/json" \
 *   -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"get_whale_flow","arguments":{"ticker":"NVDA","sentiment":"bullish","limit":10}}}'
 *
 * curl -X POST https://byzant.ai/api/mcp \
 *   -H "Content-Type: application/json" \
 *   -d '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"get_congressional_trades","arguments":{"party":"Democrat","limit":10}}}'
 *
 * This is the Phase 2 request-response transport for Vercel. Tool logic lives in
 * src/lib/mcp/tools so future migration to persistent hosting with SSE/WebSocket
 * transport only swaps the server wrapper. The persistent hosting migration path
 * is documented in the Byzant blueprint.
 */

import { NextResponse } from "next/server";
import { validateByzantApiKey } from "@/lib/api-keys/byzant-api-keys";
import { getCongressionalTrades } from "@/lib/mcp/tools/congressional-trades";
import { getWhaleFlow } from "@/lib/mcp/tools/whale-flow";

type JsonRpcId = string | number | null;

type McpRequest = {
  jsonrpc?: unknown;
  id?: JsonRpcId;
  method?: unknown;
  params?: unknown;
};

type ToolCallParams = {
  name?: unknown;
  arguments?: unknown;
};

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const JSON_RPC_VERSION = "2.0";
const UNAUTHORIZED_CODE = -32001;
const UNAUTHORIZED_MESSAGE = "Unauthorized — valid Byzant API key required";

const TOOLS = [
  {
    name: "get_whale_flow",
    description:
      "Retrieve unusual options flow and whale activity from Byzant's live feed",
    inputSchema: {
      type: "object",
      properties: {
        ticker: {
          type: "string",
          description: "Optional ticker symbol filter",
        },
        sentiment: {
          type: "string",
          enum: ["bullish", "bearish"],
          description: "Optional sentiment filter",
        },
        limit: {
          type: "number",
          description: "Maximum records to return. Defaults to 50, max 200.",
          minimum: 1,
          maximum: 200,
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "get_congressional_trades",
    description: "Retrieve recent congressional stock trade disclosures",
    inputSchema: {
      type: "object",
      properties: {
        politician: {
          type: "string",
          description: "Optional politician name filter",
        },
        party: {
          type: "string",
          enum: ["Democrat", "Republican"],
          description: "Optional party filter",
        },
        ticker: {
          type: "string",
          description: "Optional ticker symbol filter",
        },
        limit: {
          type: "number",
          description: "Maximum records to return. Defaults to 50, max 200.",
          minimum: 1,
          maximum: 200,
        },
      },
      additionalProperties: false,
    },
  },
];

function withCors(response: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(CORS_HEADERS)) {
    response.headers.set(key, value);
  }

  return response;
}

function jsonRpcResult(id: JsonRpcId | undefined, result: unknown): NextResponse {
  return withCors(
    NextResponse.json({
      jsonrpc: JSON_RPC_VERSION,
      id: id ?? null,
      result,
    })
  );
}

function jsonRpcError(
  id: JsonRpcId | undefined,
  code: number,
  message: string,
  status = 200
): NextResponse {
  return withCors(
    NextResponse.json(
      {
        jsonrpc: JSON_RPC_VERSION,
        id: id ?? null,
        error: {
          code,
          message,
        },
      },
      { status }
    )
  );
}

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function extractBearerToken(request: Request): string | null {
  const authorization = request.headers.get("authorization");
  if (!authorization) {
    return null;
  }

  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() ?? null;
}

function getToolCallParams(params: unknown): ToolCallParams | null {
  if (!isObject(params)) {
    return null;
  }

  return params;
}

function getToolArguments(args: unknown): Record<string, unknown> {
  if (args === undefined || args === null) {
    return {};
  }

  if (!isObject(args)) {
    throw new Error("Tool arguments must be an object");
  }

  return args;
}

function toolContent(data: unknown) {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(data),
      },
    ],
  };
}

function isInvalidParameterError(error: unknown): error is Error {
  if (!(error instanceof Error)) {
    return false;
  }

  return (
    error.message.includes(" must be ") ||
    error.message.includes(" must be at least ")
  );
}

async function handleToolCall(id: JsonRpcId | undefined, params: unknown) {
  const toolParams = getToolCallParams(params);
  if (!toolParams || typeof toolParams.name !== "string") {
    return jsonRpcError(id, -32602, "Invalid tool call parameters");
  }

  let args: Record<string, unknown>;
  try {
    args = getToolArguments(toolParams.arguments);
  } catch {
    return jsonRpcError(id, -32602, "Invalid tool arguments");
  }

  try {
    if (toolParams.name === "get_whale_flow") {
      const data = await getWhaleFlow(args);
      return jsonRpcResult(id, toolContent(data));
    }

    if (toolParams.name === "get_congressional_trades") {
      const data = await getCongressionalTrades(args);
      return jsonRpcResult(id, toolContent(data));
    }

    return jsonRpcError(id, -32601, "Unknown tool name");
  } catch (error) {
    if (isInvalidParameterError(error)) {
      return jsonRpcError(id, -32602, error.message);
    }

    const message =
      error instanceof Error && !error.message.startsWith("Failed to fetch")
        ? error.message
        : "Tool execution failed";

    return jsonRpcError(id, -32000, message);
  }
}

export async function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }));
}

export async function POST(request: Request) {
  let body: McpRequest;

  try {
    const parsed = await request.json();
    if (!isObject(parsed)) {
      return jsonRpcError(null, -32600, "Invalid request");
    }
    body = parsed as McpRequest;
  } catch {
    return jsonRpcError(null, -32700, "Parse error", 400);
  }

  if (body.jsonrpc !== JSON_RPC_VERSION || typeof body.method !== "string") {
    return jsonRpcError(body.id, -32600, "Invalid request");
  }

  const apiKey = extractBearerToken(request);
  if (!apiKey || !(await validateByzantApiKey(apiKey))) {
    return jsonRpcError(body.id, UNAUTHORIZED_CODE, UNAUTHORIZED_MESSAGE);
  }

  if (body.method === "tools/list") {
    return jsonRpcResult(body.id, { tools: TOOLS });
  }

  if (body.method === "tools/call") {
    return handleToolCall(body.id, body.params);
  }

  return jsonRpcError(body.id, -32601, "Unknown method");
}

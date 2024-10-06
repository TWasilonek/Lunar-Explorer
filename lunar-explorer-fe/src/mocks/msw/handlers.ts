import { restApi } from "@/paths";
import { http, HttpResponse } from "msw";
import { tripsMock } from "../trips.mock";

export const handlers = [
  http.get(
    restApi.trips.list("?startDate=2024-05-01&endDate=2024-10-15"),
    () => {
      return HttpResponse.json(tripsMock);
    }
  ),
];

import { faker } from "@faker-js/faker";
import { type APIRequestContext } from "@playwright/test";

/**
 * Helpers de API para restful-booker (una API CRUD + auth de práctica, con la
 * misma forma que cualquier API enterprise: recurso, autenticación por token,
 * códigos HTTP estándar).
 */
export const API = "https://restful-booker.herokuapp.com";

export type Booking = {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: { checkin: string; checkout: string };
  additionalneeds: string;
};

/** Factory: arma un booking sintético (Faker + overrides). */
export function makeBooking(overrides: Partial<Booking> = {}): Booking {
  const checkin = faker.date.soon({ days: 30 });
  const checkout = faker.date.soon({ days: 10, refDate: checkin });
  const isoDate = (d: Date) => d.toISOString().slice(0, 10);
  return {
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    totalprice: faker.number.int({ min: 50, max: 2000 }),
    depositpaid: faker.datatype.boolean(),
    bookingdates: { checkin: isoDate(checkin), checkout: isoDate(checkout) },
    additionalneeds: faker.helpers.arrayElement(["Breakfast", "Parking"]),
    ...overrides,
  };
}

/**
 * Obtiene un token de autenticación. Las operaciones que MODIFICAN datos
 * (update, delete) lo exigen — igual que una API real protege sus endpoints.
 */
export async function getAuthToken(request: APIRequestContext): Promise<string> {
  const res = await request.post(`${API}/auth`, {
    data: { username: "admin", password: "password123" },
  });
  const { token } = await res.json();
  return token;
}

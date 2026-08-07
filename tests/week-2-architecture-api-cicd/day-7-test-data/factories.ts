import { faker } from "@faker-js/faker";

/**
 * FACTORIES — funciones que fabrican datos de prueba con Faker.
 *
 * Patrón clave: valores por defecto aleatorios + `overrides`. Así podés pedir
 * "un cliente cualquiera" (makeCustomer()) o "un cliente con un dato fijo"
 * (makeCustomer({ postalCode: "07800" })) cuando el test necesita controlar algo.
 */

// ---------- Cliente (para el checkout de SauceDemo) ----------
export type Customer = {
  firstName: string;
  lastName: string;
  postalCode: string;
};

export function makeCustomer(overrides: Partial<Customer> = {}): Customer {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    postalCode: faker.location.zipCode(),
    ...overrides, // lo que pases pisa los valores generados
  };
}

// ---------- Booking (para el ejemplo de setup vía API) ----------
export type Booking = {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: { checkin: string; checkout: string };
  additionalneeds: string;
};

export function makeBooking(overrides: Partial<Booking> = {}): Booking {
  const checkin = faker.date.soon({ days: 30 });
  const checkout = faker.date.soon({ days: 10, refDate: checkin });
  const isoDate = (d: Date) => d.toISOString().slice(0, 10); // "YYYY-MM-DD"

  return {
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    totalprice: faker.number.int({ min: 50, max: 2000 }),
    depositpaid: faker.datatype.boolean(),
    bookingdates: { checkin: isoDate(checkin), checkout: isoDate(checkout) },
    additionalneeds: faker.helpers.arrayElement([
      "Breakfast",
      "Parking",
      "Late checkout",
    ]),
    ...overrides,
  };
}

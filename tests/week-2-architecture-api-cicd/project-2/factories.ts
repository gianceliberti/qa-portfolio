import { faker } from "@faker-js/faker";

/**
 * Factories con Faker (Día 7): datos sintéticos, realistas, distintos en cada
 * corrida. Patrón: valores por defecto aleatorios + `overrides`.
 */

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
    ...overrides,
  };
}

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

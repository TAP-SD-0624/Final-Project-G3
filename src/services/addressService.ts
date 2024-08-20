import Address from "../models/Address";

const createAddressService = async (state: string, city: string, street: string, pin: string) => {
  const address = await Address.create({ 
    state,
    city,
    street,
    pin,
  });
  return address;
};

export { createAddressService };
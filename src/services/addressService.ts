import Address from '../models/Address';

const createAddressService = async(
  state: string,
  city: string,
  street: string,
  pin: string,
  orderId: string) => {
  const address = await Address.create({
    state,
    city,
    street,
    pin,
    orderId,
  });
  return address;
};

export { createAddressService };

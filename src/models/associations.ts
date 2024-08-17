import Address from './Address';
import Brand from './Brand';
import CarouselSlide from './CarouselSlide';
import Category from './Category';
import Order from './Order';
import ProductImage from './ProductImage';
import Product from './Product';
import User from './User';
import WishList from './Wishlist';
import Review from './Review';
import OrderItem from './OrderItem';

const associateModels = (): void => {
  // --------------- User Associations --------------- :

  // A user has one order
  User.hasOne(Order, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  Order.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  // A user has one wishlist which has many products , and wishlist belongs to one user.
  User.hasOne(WishList, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  WishList.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  // A user has many reviews but a review belongs to one user
  User.hasMany(Review, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  Review.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  // --------------- Product Associations --------------- :

  // A product belongs to one brand while a brand has many products
  Brand.hasMany(Product, {
    foreignKey: 'brandId',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  });
  Product.belongsTo(Brand, {
    foreignKey: 'brandId',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  });

  // A product belongs to one category while a category has many products
  Category.hasMany(Product, {
    foreignKey: 'categoryId',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  });
  Product.belongsTo(Category, {
    foreignKey: 'categoryId',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  });

  // A product has many images in productImages table and each image belongs to one product
  Product.hasMany(ProductImage, {
    foreignKey: 'productId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  ProductImage.belongsTo(Product, {
    foreignKey: 'productId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  // An order has many products through order items
  Order.belongsToMany(Product, {
    through: OrderItem,
    foreignKey: 'orderId',
    onDelete: 'CASCADE', // Orders will be deleted if an Order is deleted
    onUpdate: 'CASCADE',
  });
  Product.belongsToMany(Order, {
    through: OrderItem,
    foreignKey: 'productId',
    onDelete: 'RESTRICT', // The logic of it to be implemented in the controllers
    onUpdate: 'CASCADE',
  });

  // A product has many reviews but a review belongs to one product
  Product.hasMany(Review, {
    foreignKey: 'productId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  Review.belongsTo(Product, {
    foreignKey: 'productId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  // A Wishlist has many products and one product belongs to many wishlists
  WishList.belongsToMany(Product, {
    through: 'wishListItems',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  Product.belongsToMany(WishList, {
    through: 'wishListItems',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  // --------------- Address Associations --------------- :

  // An address belongs to one order and an order has one address
  Address.hasOne(Order, {
    foreignKey: 'addressId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  Order.belongsTo(Address, {
    foreignKey: 'addressId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  // --------------- Carousel Slides Associations --------------- :

  // A category has one carousel slide and a carousel slide belongs to one category
  Category.hasOne(CarouselSlide, {
    foreignKey: 'categoryId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  CarouselSlide.belongsTo(Category, {
    foreignKey: 'categoryId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  // A Brand has one carousel slide and a carousel slide belongs to one Brand
  Brand.hasOne(CarouselSlide, {
    foreignKey: 'brandId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  CarouselSlide.belongsTo(Brand, {
    foreignKey: 'brandId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};

export default associateModels;

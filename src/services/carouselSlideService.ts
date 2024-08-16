import CarouselSlide from '../models/CarouselSlide';

const checkIfCarouselSlideExists = async(options: { id?: string }) => {
  const { id } = options;
  const query: { [key: string]: string } = {};

  if (id) {
    query.id = id;
  }

  const carouselSlide = await CarouselSlide.findOne({ where: query });
  return carouselSlide; // Return the carousel slide object or null
};

const checkIfSlideOrderExists = async(slideOrder: number): Promise<boolean> => {
  const existingSlide = await CarouselSlide.findOne({ where: { slideOrder } });
  return existingSlide !== null;
};

const checkIfSlideTitleExists = async(title: string): Promise<boolean> => {
  const existingSlide = await CarouselSlide.findOne({ where: { title } });
  return existingSlide !== null;
};

export  { checkIfSlideOrderExists , checkIfCarouselSlideExists , checkIfSlideTitleExists };

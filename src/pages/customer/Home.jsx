import Header from "../../components/Client/Header";
import Footer from "../../components/Client/Footer";
import Content from "./Animations/Content";
import Category from "./Product/Category";
import Animation from "./Animations/Animation";
import BestSellingPhone from "./Product/BestSellingPhone";
import AdvertisingImage from "./Animations/AdvertisingImage";

const Home = () => {
  return (
    <div className="">
      <Header />
      <Content />
      <Category />
      <Animation />
      <AdvertisingImage />
      <BestSellingPhone categoryId="1" />
      <BestSellingPhone categoryId="2" />
      <BestSellingPhone categoryId="3" />
      <BestSellingPhone categoryId="4" />
      <BestSellingPhone categoryId="5" />
      <BestSellingPhone categoryId="6" />
      <BestSellingPhone categoryId="7" />
      <BestSellingPhone categoryId="8" />
      <Footer  />
    </div>
  );
};

export default Home;

import ad1 from "../../../assets/client/ad1.jpg";

const AdvertisingImage = () => {
  return (
    <div className="bg-[#F2F2F2]  ">
      <div className="flex justify-center pt-10 ">
        <img src={ad1} alt="" className="rounded-2xl" />
      </div>
    </div>
  );
};

export default AdvertisingImage;

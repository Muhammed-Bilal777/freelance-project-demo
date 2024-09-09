import toast  from "react-hot-toast";
import { useGetProductsQuery } from "../redux/apis/productApi";
import Loader from "./layouts/Loader";
import MetaData from "./layouts/MetaData";
import ProductItem from "./product/ProductItem";
 

import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import CustomPagination from "./layouts/CustomPagination";
import Filters from "./layouts/Filters";
 
import CarouselComp from "./layouts/Carousel";
 
 
 
const Home = () => {

  let [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const keyword = searchParams.get('keyword' ) || ""
  const min = searchParams.get('min')
  const max=searchParams.get('max');
  const category = searchParams.get("category");
  const ratings = searchParams.get("ratings");


  
  const params = {page ,keyword}

  min !== null && (params.min=min);
  max !== null && (params.max=max);
  category !== null && (params.category = category);
  ratings !== null && (params.ratings = ratings);

  const { data, isLoading, error, isError } = useGetProductsQuery(params);
    

 //  FOR RESETING VALUES ON PAGE REFERESH <====>
  // useEffect(() => {
  //   // Reset searchParams on window reload
  //   setSearchParams({});
  // }, []);
  const columnSize = keyword ? 4:3
   
  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message);
    }
  }, [isError,error?.data?.message]);

  if (isLoading) return <Loader/>;
   
  return (
    <>
    
      <MetaData title={"Buy Best Products Online"} />
      <div className="row">
        {
          keyword && (
            <div className="col-6 col-md-3 mt-5">
             <Filters />
            </div>
          )
        }
        <div className= {  keyword ? "col-6 col-md-9 ": " col-6  col-md-12"}>
          {/* <CarouselComp /> */}
          <h1 id="products_heading" className="text-secondary">
           {
            keyword ? `${data?.products?.length} products found with keyword ${keyword}` :'Recents Products'
           }
          </h1>

          <section id="products" className="mt-5 d-flex-nowrap justify-content-center align-items-center">
            <div className="row w-100">
              {data?.products?.map((product,index) => (
                <ProductItem columnSize={columnSize} key={index} product={product} />
              ))}
            </div>
          </section>
        </div>
        <CustomPagination
            resPerPage={data?.resPerPage}
            totalProducts={data?.totalProducts}
          />
      </div>
    </>
  );
};

export default Home;
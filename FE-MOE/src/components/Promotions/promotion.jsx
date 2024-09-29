import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { fetchAllDiscounts, postDiscount, deleteDiscount } from "~/apis/discountApi";
import { useForm } from "react-hook-form";
import discountApi from './apis/discountApi';

function Promo(){
  useEffect(() =>{
    const fetchPromotions = async() =>{
      const promotionList = await discountApi.getAll();
      console.log(promoList);
    }
  })
}


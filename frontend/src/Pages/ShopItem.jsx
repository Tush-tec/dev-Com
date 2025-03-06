import React from 'react'
import { useParams } from 'react-router-dom'

const ShopItem = () => {

    const {productId} = useParams()


  return (
    <div>ShopItem</div>
  )
}

export default ShopItem
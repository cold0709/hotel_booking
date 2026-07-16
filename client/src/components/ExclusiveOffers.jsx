import React from 'react'
import Title from './Title'
import { assets, exclusiveOffers } from '../assets/assets'

const ExclusiveOffers = () => {
  return (
    <div className='flex flex-col items-centre px-6 md:px lg:px-24 xl:px-32 pt-20 pb-30'>
      <div className='flex flex-col md:flrx-row items-centre justify-between w-full'>
        <Title align='left' title='Exclusive Offers' subTitle='Take advantageof our limited time offer and special packages to enhance your stay and create unforgatable memories.'/>
        <button className='group flex items-centre gap-2 font-medium cursor-pointer max-:mt-12' >
          View All offers
          <img src={assets.arrowIcon} alt="arrow-icon"
          className='group-hover:translates-x-1 transition-all' />
        </button>
      </div>
      <div className='grid grid-cols-1 md:grid=cols-2 lg:grid-cols-3 gap-6 mt-12' >
       {exclusiveOffers.map((item) => (
  // so .map() returns one root element per item — required by JSX
  <div key={item._id} className='group'>

    
    <div
      className='relative flex flex-col items-start justify-between gap-1 pt-12 md:pt-18 px-4 rounded-xl text-white bg-no-repeat bg-cover bg-center'
      style={{ backgroundImage: `url(${item.image})` }}
    >
      <p className='px-3 py-1 absolute top-4 left-4 text-xs bg-white text-gray-800 font-medium rounded-full'>
        {item.priceOff}% OFF
      </p>
      <p className='text-3xl font-medium font-playfair'>{item.title}</p>
      <p>{item.description}</p>
      <p className='text-xs text-white/70 mt-3'>Expires {item.expiryDate}</p>
    </div>

    <button className='flex items-center gap-2 font-medium cursor-pointer mt-4 mb-5'>
      View Offers
      <img
        className='invert group-hover:translate-x-1 transition-all'
        src={assets.arrowIcon}
        alt="arrow-icon"
      />
    </button>

  </div>
))}
      </div>
    </div>
  )
}

export default ExclusiveOffers
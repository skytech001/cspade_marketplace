const data = {
  products: [
    {
      id: "1",
      name: "Slim Fitted Shirt",
      image: [
        "http://res.cloudinary.com/dlp9idmqm/image/upload/v1672947733/product_images/mpk1dphsbxpchnoe4nc8.jpg",
      ],
      brand: "slim ",
      category: "shirts",
      description:
        "Mens slim fitted shirt. comes in all sizes. returns available for eligible purchases.",
      price: 50,
      countInStock: 23,
      rating: 4.6,
      numReviews: 14,
    },
    {
      id: "2",
      name: "Designer Shirt",
      image: [
        "http://res.cloudinary.com/dlp9idmqm/image/upload/v1672948100/product_images/xojybc2hgcoy8bz3owpl.jpg",
      ],
      brand: "slim",
      category: "shirts",
      description: "Men's designer shirts, different colors available",
      price: 90,
      countInStock: 34,
      rating: 4.4,
      numReviews: 17,
    },
    {
      id: "3",

      name: "Colored collar Shirt",
      image: [
        "http://res.cloudinary.com/dlp9idmqm/image/upload/v1672948232/product_images/elfh8lowq9cr4kmv72ox.webp",
      ],
      brand: "slim",
      category: "shirts",
      description:
        "Beautiful colored collar shirt, an amazing gift for your self or your man",
      price: 80,
      countInStock: 23,
      rating: 4.9,
      numReviews: 80,
    },
    {
      id: "4",
      name: "Solid Office Shirt",
      image: [
        "http://res.cloudinary.com/dlp9idmqm/image/upload/v1672948404/product_images/asvlmop9ocnewn0yv10m.jpg",
      ],
      brand: "office wear",
      category: "shirts",
      description:
        "Wow your colleges with this awesome shirt. It fits all body types.",
      price: 75,
      countInStock: 33,
      rating: 4.0,
      numReviews: 45,
    },
    {
      id: "5",
      name: "Loose Blouse",
      image: [
        "http://res.cloudinary.com/dlp9idmqm/image/upload/v1672948555/product_images/eyrbqbjxkqazgywinhfg.jpg",
        "http://res.cloudinary.com/dlp9idmqm/image/upload/v1672948556/product_images/vpahppekywvceik7yeno.jpg",
      ],
      brand: "discover",
      category: "blouse",
      description: "Beautiful summer blouse for the gorgeous woman",
      price: 110,
      countInStock: 48,
      rating: 3.9,
      numReviews: 300,
    },
    {
      id: "6",
      name: "working woman blouse",
      image: [
        "http://res.cloudinary.com/dlp9idmqm/image/upload/v1672948747/product_images/wbwkkm500iqhruwqokwm.jpg",
      ],
      brand: "discover",
      category: "blouse",
      description: "Fine red blouse, for all occasions",
      price: 65,
      countInStock: 34,
      rating: 4.2,
      numReviews: 60,
    },
    {
      id: "7",
      name: "Loose gown ",
      image: [
        "http://res.cloudinary.com/dlp9idmqm/image/upload/v1672948914/product_images/wli2c1ilyw7rpcoafjqp.jpg",
      ],
      brand: "discover",
      category: "blouse",
      description: "Loose maternity gown for all stages of pregnancy",
      price: 54,
      countInStock: 65,
      rating: 4.8,
      numReviews: 23,
    },
    {
      id: "8",
      name: "Bright blouse",
      image: [
        "http://res.cloudinary.com/dlp9idmqm/image/upload/v1672949067/product_images/plqjmhuixqn4flngopav.webp",
      ],
      brand: "discover",
      category: "blouse",
      description: "This is our best blouse by far. Order your now",
      price: 87,
      countInStock: 64,
      rating: 5,
      numReviews: 100,
    },
    {
      id: "9",
      name: "Men formal wear",
      image: [
        "http://res.cloudinary.com/dlp9idmqm/image/upload/v1672949247/product_images/sz4njtugnpoovkrfvvch.webp",
      ],
      brand: "slim",
      category: "shirts",
      description: "Men's formal wear, ",
      price: 110,
      countInStock: 56,
      rating: 4.1,
      numReviews: 70,
    },
    {
      id: "10",
      name: "Dress shoe",
      image: [
        "http://res.cloudinary.com/dlp9idmqm/image/upload/v1672949351/product_images/gjkaodiuxq62ithh73e3.webp",
        "http://res.cloudinary.com/dlp9idmqm/image/upload/v1672949521/product_images/n5si2mchxpkelubqtpbt.jpg",
      ],
      brand: "discover",
      category: "shoes",
      description: "Amazing princes-like shoe",
      price: 180,
      countInStock: 0,
      rating: 4.9,
      numReviews: 23,
    },
    {
      id: "11",
      name: "Nike running shoe",
      image: [
        "http://res.cloudinary.com/dlp9idmqm/image/upload/v1672949635/product_images/zdbyc39awkqfvtgrbcz9.jpg",
      ],
      brand: "nike",
      category: "shoes",
      description: "Perfect running shoe",
      price: 160,
      countInStock: 57,
      rating: 5.0,
      numReviews: 30,
    },
    {
      id: "12",
      name: "Nike gym shoe",
      image: [
        "http://res.cloudinary.com/dlp9idmqm/image/upload/v1672949742/product_images/xkhqzo5l57hvpnvhlvma.webp",
      ],
      brand: "nike",
      category: "shoes",
      description: "Good for sports, parties and running",
      price: 170,
      countInStock: 86,
      rating: 4.9,
      numReviews: 1,
    },
    {
      id: "13",
      name: "All star",
      image: [
        "http://res.cloudinary.com/dlp9idmqm/image/upload/v1672949862/product_images/m1qbbreesbhge5zbarko.webp",
        "http://res.cloudinary.com/dlp9idmqm/image/upload/v1672949863/product_images/j9hrg30jyj7msjuwjlp5.jpg",
      ],
      brand: "allstar",
      category: "shoes",
      description: "sweet all star shoe for all occasions ",
      price: 178,
      countInStock: 34,
      rating: 4.7,
      numReviews: 450,
    },
    {
      id: "14",
      name: "Soft casual shoe",
      image: [
        "http://res.cloudinary.com/dlp9idmqm/image/upload/v1672950032/product_images/itejovyzrr1midkoyhaf.jpg",
      ],
      brand: "nike",
      category: "shoes",
      description: "casual shoe for work, climbing, everything",
      price: 76,
      countInStock: 93,
      rating: 4.8,
      numReviews: 76,
    },
    {
      id: "15",
      name: "Nike boys shoe",
      image: [
        "http://res.cloudinary.com/dlp9idmqm/image/upload/v1672950112/product_images/tmgmdmchil6uzpommtgy.webp",
        "http://res.cloudinary.com/dlp9idmqm/image/upload/v1672950113/product_images/bpwkzp35gsl3strvw1cq.jpg",
      ],
      brand: "nike",
      category: "shoes",
      description: "shoes for boys ",
      price: 170,
      countInStock: 34,
      rating: 4.0,
      numReviews: 12,
    },
  ],
};

export default data;

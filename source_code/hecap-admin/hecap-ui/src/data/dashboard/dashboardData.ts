import type { recentTrans, productPerformanceType, productsCards } from '@/types/dashboard/index';

/*--Recent Transaction--*/
const recentTransaction: recentTrans[] = [
    {
        title: '03/30',
        subtitle: 'John Smith',
        textcolor: 'primary',
        boldtext: false,
        line: true,
        link: '',
        url: ''
    },
    {
        title: '03/28',
        subtitle: 'Liam Smith',
        textcolor: 'secondary',
        boldtext: true,
        line: true,
        link: '',
        url: ''
    },
    {
        title: '03/26',
        subtitle: 'Emma Smith',
        textcolor: 'success',
        boldtext: false,
        line: true,
        link: '',
        url: ''
    },
    {
        title: '03/22',
        subtitle: 'Noah Smith',
        textcolor: 'warning',
        boldtext: true,
        line: true,
        link: '#ML-3467',
        url: ''
    },
    {
        title: '03/20',
        subtitle: 'Olivia Smith',
        textcolor: 'error',
        boldtext: true,
        line: true,
        link: '',
        url: ''
    },
    {
        title: '03/12',
        subtitle: 'Tom Smith',
        textcolor: 'success',
        boldtext: false,
        line: false,
        link: '',
        url: ''
    },
]

/*Basic Table 1*/
const productPerformance: productPerformanceType[] = [
    {
        id: 1001,
        name: 'A&D M2023',
        post: 'Web Designer',
        pname: 'Upper Arm Blood Pressure Monitor',
        status: '3/20/23',
        statuscolor: 'primary',
        budget: '$39'
    },
    {
        id: 1002,
        name: 'A&D M2023',
        post: 'Web Designer',
        pname: 'Upper Arm Blood Pressure Monitor',
        status: '3/20/23',
        statuscolor: 'primary',
        budget: '$39'
    },
    {
        id: 1003,
        name: 'A&D M2023',
        post: 'Web Designer',
        pname: 'Upper Arm Blood Pressure Monitor',
        status: '3/20/23',
        statuscolor: 'primary',
        budget: '$39'
    },
    {
        id: 1004,
        name: 'A&D M2023',
        post: 'Web Designer',
        pname: 'Upper Arm Blood Pressure Monitor',
        status: '3/20/23',
        statuscolor: 'primary',
        budget: '$39'
    },

];

/*--Products Cards--*/
import proimg1 from '@/assets/images/products/r1.jpg';
import proimg2 from '@/assets/images/products/r1.jpg';
import proimg3 from '@/assets/images/products/r1.jpg';
import proimg4 from '@/assets/images/products/r1.jpg';
const productsCard: productsCards[] = [
    {
        title: 'A&D Upper Arm',
        link: '/',
        photo: proimg1,
        salesPrice: 0,
        price: 39,
        rating: 4
    },
    {
        title: 'Mac Upper Arm',
        link: '/',
        photo: proimg2,
        salesPrice: 0,
        price: 39,
        rating: 5
    },
    {
        title: 'Red Upper Arm',
        link: '/',
        photo: proimg3,
        salesPrice: 0,
        price: 50,
        rating: 3
    },
    {
        title: 'Cute Upper Arm',
        link: '/',
        photo: proimg4,
        salesPrice: 0,
        price: 20,
        rating: 2
    }
];


export { recentTransaction, productPerformance, productsCard }
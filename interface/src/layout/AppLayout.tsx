import { Outlet } from 'react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';


const AppLayout = () => {

    return(
        <div className='min-h-screen flex flex-col'>
            <Header />
            <main className='flex-grow py-6'>
                <Outlet></Outlet>
            </main>
            <Footer />
        </div>
    )
}

export default AppLayout;
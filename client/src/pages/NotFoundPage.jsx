import { useNavigate } from "react-router-dom"

const NotFoundPage = () => {
    const navigate = useNavigate();
    return (
        <section className="w-1/2 mx-auto my-20">
            <p className="text-center font-bold text-5xl">404</p>
            <p className="text-center text-xl mb-3">Page not found :(</p>
            <p className="text-center text-blue-500 hover:cursor-pointer underline" onClick={() => navigate('/')}>Navigate to Home?</p>
        </section>
    )
}

export default NotFoundPage;

import {Routes, Route, Link} from "react-router"
import {Button} from "@/components/ui/button.tsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={
                <Button asChild>
                    <Link to="">Login</Link>
                </Button>
            }/>
        </Routes>
    )
}

export default App
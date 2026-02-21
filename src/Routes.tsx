import { Route, Routes } from "react-router-dom";
import UnchiApp from "./Components/UnchiApp/UnchiApp";
import WarikanAppMain from "./Components/warikanApp/warikanAppMain";
import TestAppMenu from "./Components/TestAppMenu/TestAppMenu";

export const AppRoutes: React.FC = () => {
    return (
        <>
          <Routes>
            <Route path='/' element={<TestAppMenu />} />
            <Route path='/warikan' element={<WarikanAppMain />} />
            <Route path='/unchi' element={<UnchiApp />} />
          </Routes>
        </>
    )
}  
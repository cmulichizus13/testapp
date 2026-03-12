import { Route, Routes } from "react-router-dom";
import UnchiApp from "./Components/UnchiApp/UnchiApp";
import WarikanAppMain from "./Components/warikanApp/warikanAppMain";
import TestAppMenu from "./Components/TestAppMenu/TestAppMenu";
// chatbotブランチでは有効にする
import GeneralChatbot from "./Components/GeneralChatbot/GeneralChatbot";
import QuizAppMenu from "./Components/QuizApp/QuizAppMenu";
import QuizApp from "./Components/QuizApp/QuizApp";

export const AppRoutes: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<TestAppMenu />} />
        <Route path='/warikan' element={<WarikanAppMain />} />
        <Route path='/unchi' element={<UnchiApp />} />
        {/* chatbotブランチでは有効にする */}
        <Route path='/chatbot' element={<GeneralChatbot />} />
        <Route path='/quiz' element={<QuizAppMenu />} />
        <Route path='/quiz/:id' element={<QuizApp />} />
      </Routes>
    </>
  )
}  
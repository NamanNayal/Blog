import React from 'react'
import { useSelector } from 'react-redux'

export default function ThemeProvider({children}) {
    const {theme} = useSelector(state=>state.theme);
  return (
    <div className={`${theme} transition-colors duration-300 ease-in-out`}>
        <div className={theme === "dark" ? "dark" : ""}>
       {children}
       </div>
    </div>
  )
}

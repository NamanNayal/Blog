import React from 'react'
import { useSelector } from 'react-redux'

export default function ThemeProvider({children}) {
    const {theme} = useSelector(state=>state.theme);
  return (
    <div className={theme}>
        <div className={theme === "dark" ? "dark" : ""}>
       {children}
       </div>
    </div>
  )
}

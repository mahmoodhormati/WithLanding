import {useEffect, useState} from "react";

const Setting = () => {
    const [mode, setMode] = useState(getDefaultMode());

    function getDefaultMode() {
        const savedMode = localStorage.getItem('mode');
        return savedMode ? savedMode : 'light';
    } 
useEffect(()=>{
    const body = document.body
    const toggle = document.querySelector('.toggle-inner')

    if (mode === 'dark'){
        body.classList.add('dark-mode')

        toggle.classList.add('toggle-active')

    } if (mode === 'light') {
        body.classList.remove('dark-mode')
        toggle.classList.add('toggle-active')

    }
    localStorage.setItem('mode', mode); // mode saved to local storage

},[mode])

   
   

    return (
        <div className="App">


            <div
                id="toggle"
                onClick={() => mode === "light" ? setMode("dark") : setMode("light")}
            >
                <div className="toggle-inner"/>

            </div>

        </div>
    );
}



export default Setting

import React from "react";;

const Welcome = ({nombre}) => {
    return (
        <div>
            {nombre && nombre.toLowerCase() === 'desarrollador' ? (
                <h2>Hola desarrollador eres un crack</h2>
            ) : (
                <h2>Bienvenido {nombre}!</h2>
            )}
            <p>Este es un componente modularizado.</p>
        </div>
    );
}

export default Welcome;
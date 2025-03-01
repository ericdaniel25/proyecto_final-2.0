import io from "socket.io-client";
import NavBar from "../components/NavBar";
import PageFooter from "../components/Footer";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
const socket = io("/", { autoConnect: false });

const Chat = () => {
  // Declaracion de las variables de estado
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  //const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState({});
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // Funcion de control de estado para manejar el token de sesion
  useEffect(() => {
    // Funcion asincrona para obtener la informacion del usuario
    const fetchInfo = async () => {
      // Obtenemos el token de sesion del local storage y lo guardamos en la variable token
      const token = localStorage.getItem("tokenSesion");
      // Si el token existe entonces se ejecuta el bloque de codigo si no se redirecciona a la pagina de login
      if (token) {
        try {
          // Decodificamos el token y guardamos la informacion en la variable decoded
          const decoded = jwtDecode(token);
          // Guardamos la informacion del usuario en la variable userData
          setUserData(decoded);
          // Guardamos distintos valores del usuario en distintas variables
          const userID = decoded.id;
          const userName = decoded.name;
          const userLastName = decoded.lastName;
          const userRole = decoded.role;
          const expiry = decoded.exp;
          const currentTime = Date.now() / 1000;
          // Si el token ha expirado se elimina del local storage y se redirecciona a la pagina de login
          if (expiry < currentTime) {
            console.log("token has expired");
            localStorage.removeItem("tokenSesion");
            navigate("/login");
          }
          // Si el rol del usuario no es admin, tech o premium se redirecciona a la pagina de login
          if (
            userRole !== "admin" &&
            userRole !== "tech" &&
            userRole !== "premium"
          ) {
            navigate("/login");
          }
          // Se establece la autenticacion del socket con el id, nombre, apellido y rol del usuario
          socket.auth = { userID, userName, userLastName, userRole };
          socket.connect();
        } catch (error) {
          console.error(typeof error);
        }
      } else {
        navigate("/login");
      }
    };
    // Se ejecuta la funcion fetchInfo()
    fetchInfo();
  }, [navigate]);
  

  // Funcion para inicializar las propiedades reactivas de un usuario
  const initReactiveProperties = (user) => {
    if (!user.status) {
      user.status = "online";
    }
    user.messages = user.messages || [];
    user.hasNewMessages = user.hasNewMessages || false;
  };

  // Funcion de control de estado para manejar la conexion de un usuario
  useEffect(() => {
    socket.on("user connected", (user) => {
      initReactiveProperties(user);
      setUsers((prevUsers) => [...prevUsers, user]); // Actualiza el estado de forma inmutable
    });

    const handleConnect = () => {
      setUsers((prevUsers) => {
        return prevUsers.map((user) => {
          if (user.self) {
            return { ...user, status: true };
          }
          return user;
        });
      });
    };

    const handleDisconnect = () => {
      setUsers((prevUsers) => {
        return prevUsers.map((user) => {
          if (user.self) {
            return { ...user, status: false };
          }
          return user;
        });
      });
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  // Funcion para renderizar los usuarios conectados
  useEffect(() => {
    // Se recibe la lista de usuarios conectados
    socket.on("users", (receivedUsers) => {
      // Se mapea la lista de usuarios y se actualiza el estado de los usuarios
      const updatedUsers = receivedUsers.map((user) => {
        const updatedUser = { ...user };
        updatedUser.self = updatedUser.userID === socket.id;

        // Lógica para simular initReactiveProperties (ejemplo con 'status')
        if (!updatedUser.status) {
          updatedUser.status = "online";
        }

        return updatedUser;
      });
      // Se ordenan los usuarios por nombre
      const sortedUsers = updatedUsers.sort((a, b) => {
        if (a.self) return -1;
        if (b.self) return 1;
        if (a.username < b.username) return -1;
        return a.username > b.username ? 1 : 0;
      });

      setUsers(sortedUsers);
    });

    return () => {
      socket.off("users"); // Limpieza del listener
    };
  }, []);

  // Funcion para manejar el envio de un mensaje
  const onMessage = (content) => {
    if (selectedUser) {
      socket.emit("private message", {
        content,
        to: selectedUser.userID,
      });

      // Actualiza el estado de selectedUser de forma inmutable
      setSelectedUser((prevSelectedUser) => {
        if (!prevSelectedUser) return null; // Maneja el caso de que no haya usuario seleccionado

        // Asegúrate de que prevSelectedUser.messages es un array
        const updatedMessages = [
          ...(prevSelectedUser.messages || []),
          { content, fromSelf: true },
        ];

        // Crea una copia del objeto selectedUser con la matriz de mensajes actualizada
        return {
          ...prevSelectedUser,
          messages: updatedMessages,
        };
      });
    }
  };

  // Funcion para enviar un mensaje
  const handlesubmit = (e) => {
    // Se previene el comportamiento por defecto del formulario
    e.preventDefault();
    // Se crea un nuevo mensaje con el contenido del mensaje y el remitente
    if (message.trim()) {
      onMessage(message.trim());
      setMessage("");
    }
  };

  // Funcion de control de estado para manejar los mensajes
  useEffect(() => {
    socket.on("private message", ({ content, from }) => {
      setUsers((prevUsers) => {
        return prevUsers.map((user) => {
          if (user.userID === from) {
            const updatedUser = { ...user };
            updatedUser.messages = updatedUser.messages || [];
            updatedUser.messages.push({
              content,
              fromSelf: false,
            });
            if (updatedUser !== selectedUser) {
              updatedUser.hasNewMessages = true;
            }
            return updatedUser;
          }
          return user;
        });
      });
    });

    return () => {
      socket.off("private message");
    };
  }, [selectedUser]);

  return (
    <>
      <NavBar />
      <div className="flex flex-col justify-center w-full h-full bg-gradient-to-b from-azul4 via-azul3 to-azul1 ">
        <div className="flex flex-row w-full h-screen">
          <div className="hidden sm:block sm:w-1/6 sm:h-full">
            <div className="flex flex-col bg-white/40 border-r-2 border-gray-400 w-full h-full justify-start items-center">
              <ul className="w-full h-full overflow-y-auto">
                {users.map((user) => (
                  <li
                    className="text-grey-800 hover:text-white hover:bg-azul3 p-2 rounded-md cursor-pointer "
                    key={user.userID}
                    onClick={() => setSelectedUser(user)}
                  >
                    {user.username} {user.self ? "(Tú)" : ""} - Estado:{" "}
                    {user.status ? "online" : "offline"}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex flex-col w-full h-full">
            <form
              onSubmit={handlesubmit}
              className="flex flex-col w-full h-full justify-between"
            >
              <div className="flex flex-col justify-end w-full h-full">
                <ul className="w-full h-full overflow-y-auto flex flex-col p-2 justify-end">
                  {selectedUser &&
                    selectedUser?.messages?.map((message, index) => (
                      <li
                        key={index}
                        className={`my-2 p-2 table text-sm rounded-md ${
                          message.fromSelf
                            ? "bg-azul3 ml-auto"
                            : "bg-azul4 mr-auto"
                        }`}
                      >
                        <b>{message.fromSelf ? "Me" : selectedUser.username}</b>
                        :{message.content}
                      </li>
                    ))}
                </ul>
              </div>
              <div className="flex flex-row justify-between items-center z-10 w-full h-16 bg-azul3 rounded">
                <input
                  className="w-full h-4/6 p-2 text-black border-2 border-azul4 rounded-lg"
                  type="text"
                  placeholder="Escribe tu mensaje"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  autoFocus
                />
                <button
                  className="bg-azul4 text-white px-6 py-3 rounded-lg drop-shadow-lg hover:-translate-y-1 hover:scale-110  duration-300"
                  onClick={handlesubmit}
                >
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <PageFooter />
    </>
  );
};

export default Chat;

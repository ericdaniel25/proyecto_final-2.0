import {
  Button,
  Card,
  Label,
  TextInput,
  Datepicker,
} from "flowbite-react";

const Invoice = () => {
  return (
    <div className="flex flex-col justify-evenly items-center w-screen h-screen bg-gray-200">
      <h1 className="drop-shadow-md text-center text-gray-900 text-3xl pb-4">Factura</h1>
      <Card className="max-w-sm bg-white/19 backdrop-blur-2xl backdrop-saturate-90 rounded-lg border border-gray-200/30 drop-shadow-2xl shadow-2xl">
        <form className="flex max-w-md flex-col gap-4 ">
          <div>
            <div className="mb-2 block">
              <Label
                className="text-gray-900 drop-shadow-md"
                htmlFor="titulo3"
                value="TITULO"
              />
            </div>
            <TextInput id="titulo3" type="text" placeholder="titulo" required />
          </div>
          <div>
            <div className="mb-2 block">
              <Label
                className="text-gray-900 drop-shadow-md"
                htmlFor="descripcion3"
                value="NOMBRE"
              />
            </div>
            <TextInput
              className="text-xs"
              id="descripcion3"
              placeholder="Juan"
              required
              rows={4}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label
                className="text-gray-900 drop-shadow-md"
                htmlFor="descripcion3"
                value="APELLIDO"
              />
            </div>
            <TextInput
              className="text-xs"
              id="descripcion3"
              placeholder="Perez"
              required
              rows={4}
            />
          </div>

          <div>
            <div className="mb-2 block">
              <Label
                className="text-gray-900 drop-shadow-md"
                htmlFor="fecha3"
                value="FECHA"
              />

              <Datepicker id="fecha3" minDate={new Date()} />
            </div>
          </div>

          <Button className="bg-azul2 drop-shadow-md" type="submit">
            <p>Guardar Factura</p>
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Invoice;

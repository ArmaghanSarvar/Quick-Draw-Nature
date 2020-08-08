import asyncio
import websockets
import os

import NeuralNetwork


async def receive(websocket, path):
    while True:
        data = await websocket.recv()
        if type(data) == bytes:
            prediction = NeuralNetwork.predict(data)
            await websocket.send(prediction)
            print(f"> {prediction}")
        elif data == "displayImage":
            NeuralNetwork.display_current_image()
        else:
            print(data)


start_server = websockets.serve(
    receive, "localhost", 31800
)

NeuralNetwork.load_model()

os.startfile(os.getcwd() + "/../index.html")

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()

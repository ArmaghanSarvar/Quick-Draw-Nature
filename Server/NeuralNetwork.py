from tensorflow.keras.models import Sequential
from tensorflow.keras.models import model_from_json
import numpy
import pickle
from matplotlib import pyplot

loaded_model = None

categories = None

image_width = 28
image_height = 28
channels = 1

current_image = None


def load_model():
    global loaded_model

    load_categories()

    json_file = open('Data/trained_model.json', 'r')
    loaded_model_json = json_file.read()
    json_file.close()

    loaded_model = model_from_json(loaded_model_json)
    loaded_model.load_weights('Data/model.h5')

    print("Model successfully loaded!")


def are_dif(last, cur):
    counter = 0
    for i in range(image_height * image_width):
        if last[i] != cur[i]:
            counter += 1
    return counter >= 10


def predict(data):
    data = format_data(data)
    results = loaded_model.predict_classes(data)
    return [category_to_string(result) for result in results][0]


def generate_dummy_data(num):
    data = numpy.ndarray((num, image_width, image_height, channels))
    for i in range(num):
        for j in range(image_width):
            for k in range(image_width):
                for l in range(channels):
                    data[i][j][k][l] = numpy.random.randint(0, 255)
    return data


def format_data(data):
    array = numpy.frombuffer(data, dtype=int)
    array = numpy.array([element >> 24 if element >> 24 >= 0 else (element >> 24) + 256 for element in array.tolist()])
    array = array.reshape((200, 300, channels))
    return compress_image(array).reshape((1, image_width, image_height, channels))


def compress_image(image):
    global current_image
    compressed_image = numpy.ndarray((image_width, image_height, channels))
    kernel_size = [int(image.shape[0] / image_width), int(image.shape[1] / image_height)]
    # for i in range(int(len(compressed_image) / channels)):
    #     row = int(i / image_width)
    #     col = int(i % image_width)
    #     point_in_orig = [row * kernel_size[0], col * kernel_size[1]]
    #     for k in range(channels):
    #         sum = numpy.sum(image[point_in_orig[0]: point_in_orig[0] + kernel_size[0],
    #                         point_in_orig[1]: point_in_orig[1] + kernel_size[1], k])
    #         compressed_image[i * channels + k] = sum
    #         compressed_image[i * channels + k] /= kernel_size[0] * kernel_size[1]
    #         compressed_image[i * channels + k] = int(compressed_image[i * channels + k])
    for i in range(image_width):
        for j in range(image_height):
            for k in range(channels):
                value = 0
                for x in range(i * kernel_size[0], min((i + 1) * kernel_size[0], 100000000)):
                    for y in range(j * kernel_size[1], min((j + 1) * kernel_size[1], 100000000)):
                        if image[x][y][k] > value:
                            value = image[x][y][k]
                compressed_image[i][j][k] = value

    # display_image(image.reshape((image.shape[0], image.shape[1])))
    # display_image(compressed_image.reshape((image_width, image_height)))
    current_image = compressed_image.reshape((image_width, image_height))
    return compressed_image


def display_current_image():
    display_image(current_image)


def display_image(image):
    pyplot.imshow(image, cmap="binary")
    pyplot.show()


def category_to_string(category):
    return categories[category]


def load_categories():
    global categories
    pickle_in = open("Data/categories.pickle", "rb")
    categories = pickle.load(pickle_in)

import serial
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

# ----- CONFIGURE THIS -----
SERIAL_PORT = 'COM6'  # Replace with your ESP32 port (e.g., 'COM4' or '/dev/ttyUSB0')
BAUD_RATE = 115200
# --------------------------

# Serial connection
ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)

angles = []
sine_values = []

# Set up the figure
fig, ax = plt.subplots()
line, = ax.plot([], [], 'r-')
ax.set_title("Real-Time Sine Wave from ESP32")
ax.set_xlabel("Angle (degrees)")
ax.set_ylabel("Sine Value")
ax.set_xlim(0, 1440)
ax.set_ylim(-1.2, 1.2)

def update(frame):
    global angles, sine_values

    while ser.in_waiting:
        try:
            raw_line = ser.readline().decode().strip()
            if ',' in raw_line:
                angle_str, sine_str = raw_line.split(',')
                angle = float(angle_str)
                sine = float(sine_str)

                angles.append(angle)
                sine_values.append(sine)

                # Limit number of points to last 100
                if len(angles) > 100:
                    angles = angles[-100:]
                    sine_values = sine_values[-100:]
        except Exception as e:
            print(f"Error reading line: {e}")

    # Update line
    line.set_data(angles, sine_values)
    if angles:
        ax.set_xlim(max(0, angles[0]), angles[-1] + 10)
    return line,

ani = FuncAnimation(fig, update, interval=200)
plt.tight_layout()
plt.show()

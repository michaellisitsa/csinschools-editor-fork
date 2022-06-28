from speech import *
from microbit import *
from csinsc import *

# Connect to the micro:bit
regi = Microbit()

# Create our loop
label .again

# Wait for the user to press a button
print("Press any button, then ask me what you need!")
regi.waitForButtonPress()

# Get the instruction
print("I'm listening!")
choice = listen(5)
print("Finished listening.")

# Create a message based on the choice
# Create a message based on the choice
if "weather" in choice:
    message = "It is " + str(_______.getTemperature()) + " degrees."
elif "bearing" in choice:
    message = "You are facing " + ___(______.________()) + " degrees from north."
elif "____" in choice:
    message = ____________
else:
    message = ____________

# Say the message and return to the start 
say(message)
goto .again

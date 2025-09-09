from dotenv import load_dotenv

# Load environment variables
load_dotenv()

```python
import os
import requests
import json

# Load API key from environment variable
API_KEY = os.getenv('WEATHER_API_KEY')
if API_KEY is None:
    raise EnvironmentError("Missing WEATHER_API_KEY environment variable")

# Constants
CITY = "Vijayawada,IN"
BASE_URL = "https://api.openweathermap.org/data/2.5/onecall"
UNITS = "metric"  # Use 'imperial' for Fahrenheit

def fetch_weather_forecast():
    """Fetch
import os
import json
import requests
import time

# Set the destination directory
DEST_DIR = "./public/data/"
CATEGORIES_DIR = os.path.join(DEST_DIR, "categories")
ACTIVITIES_DIR = os.path.join(DEST_DIR, "activities")

# Ensure directories exist
os.makedirs(CATEGORIES_DIR, exist_ok=True)
os.makedirs(ACTIVITIES_DIR, exist_ok=True)

# Download the list.json file
firstcall_url = "http://127.0.0.1/api/activities/?refresh"
list_url = "http://127.0.0.1/api/activities/list"
list_path = os.path.join(DEST_DIR, "list.json")

print("Downloading list.json...")
try:
    response = requests.get(firstcall_url)
    #wait for 5 seconds
    time.sleep(5)

    response = requests.get(list_url)
    response.raise_for_status()
    with open(list_path, "wb") as f:
        f.write(response.content)
    print("list.json downloaded successfully.")
except requests.RequestException as e:
    print(f"Error downloading list.json: {e}")
    exit(1)

# Load list.json content
with open(list_path, "r", encoding="utf-8") as f:
    data = json.load(f)

# Download category icons (excluding 'all' category)
categories = data.get("categories", {})
print("Downloading category icons...")

for category_name, subcategories in categories.items():
    if category_name == "all":
        continue  # Skip 'all' category

    for subcategory_id in subcategories.keys():
        category_url = f"http://localhost/api/icon/{category_name}/{subcategory_id}?png"
        category_icon_path = os.path.join(CATEGORIES_DIR, f"{category_name}_{subcategory_id}.png")

        try:
            response = requests.get(category_url)
            response.raise_for_status()
            with open(category_icon_path, "wb") as f:
                f.write(response.content)
            print(f"Downloaded: {category_icon_path}")
        except requests.RequestException:
            print(f"Failed to download: {category_url}")

# Download activity icons
activities = data.get("activities", [])
print("Downloading activity icons...")
for activity in activities:
    activity_id = activity.get("id", "unknown")
    icon_url = activity.get("info", {}).get("icon", "")

    if icon_url.startswith("/api/icon/"):
        icon_url = f"http://localhost{icon_url}"  # Ensure it has the correct base URL

    icon_path = os.path.join(ACTIVITIES_DIR, f"{activity_id}.png")

    try:
        response = requests.get(icon_url)
        response.raise_for_status()
        with open(icon_path, "wb") as f:
            f.write(response.content)
        print(f"Downloaded: {icon_path}")
    except requests.RequestException:
        print(f"Failed to download: {icon_url}")

print("Download completed.")

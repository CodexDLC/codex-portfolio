import os
import subprocess
import sys

def show_menu():
    print("\n--- Project Management Menu ---")
    print("1. Generate Project Tree")
    print("0. Exit")
    print("-------------------------------")

def run_tree_generator():
    script_path = os.path.join("scripts", "generate_project_tree.py")
    if os.path.exists(script_path):
        print(f"Running {script_path}...")
        try:
            subprocess.run([sys.executable, script_path], check=True)
            print("Tree generation completed.")
        except subprocess.CalledProcessError as e:
            print(f"Error running script: {e}")
    else:
        print(f"Error: Script not found at {script_path}")

def main():
    while True:
        show_menu()
        choice = input("Select an option: ")

        if choice == "1":
            run_tree_generator()
        elif choice == "0":
            print("Exiting...")
            break
        else:
            print("Invalid option, please try again.")

if __name__ == "__main__":
    main()

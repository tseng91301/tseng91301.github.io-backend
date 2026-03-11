from discord_bot import DiscordBot
import os
import subprocess

DEVELOP_MODE = False

async def handle_custom_event(message):
    if DEVELOP_MODE:
        print(f"🔔 收到自訂事件：{message}")
    if message == "startserver":
        subprocess.Popen("./start_local_server.sh", shell=True)
        server_manage_bot.send_message("✅ Server started")
    elif message == "stopserver":
        subprocess.Popen("./stop_local_server.sh", shell=True)
        server_manage_bot.send_message("✅ Server stopped")

if __name__ == "__main__":
    server_manage_bot = DiscordBot(os.environ['SERVER_MANAGE_DISCORD_BOT_TOKEN'])
    server_manage_bot.set_channel_number(int(os.environ['SERVER_MANAGE_DISCORD_BOT_CHANNEL_NUMBER']))

    server_manage_bot.on_custom_event(handle_custom_event)

    server_manage_bot.run()


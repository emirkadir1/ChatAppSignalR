using ChatAppTest.Data;
using ChatAppTest.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.VisualBasic;

namespace SignalRChat.Hubs
{
	public class ChatHub : Hub
	{
		public async Task GetNickName(string nickName)
		{
			Client client = new Client() 
			{ 
				NickName = nickName,
				ConnectionId = Context.ConnectionId
			};
            ClientSource.Clients.Add(client);
			await Clients.Caller.SendAsync("clientJoined", nickName);
            await Clients.All.SendAsync("clients", ClientSource.Clients);
        }
	
		public async Task SendMessage(string user, string message)
		{
			await Clients.All.SendAsync("ReceiveMessage", user, message);
		}
		public async Task SendMessageGroup(string user, string message, string groupName)
		{
			await Clients.Group(groupName).SendAsync("ReceiveMessage", user, message);
		}

		public override async Task OnDisconnectedAsync(Exception? exception)
		{

			await Clients.All.SendAsync("clients", ClientSource.Clients);
		}
		public async Task AddGroup(string groupName)
		{
			await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
		}
	}
}
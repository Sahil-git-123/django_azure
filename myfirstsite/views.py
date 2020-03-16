# -*- coding: utf-8 -*-
"""
Created on Sat Mar  7 02:10:21 2020

@author: sahil
"""
from django.shortcuts import render, HttpResponse, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User




def index(request):
    return render(request, 'index.html')

def login(request):
    return render(request, 'chat.html')


def handlelogin(request):
    if request.method == 'POST':
        # Get the post parameters
        loginemail = request.POST['loginemail']
        loginpassword = request.POST['loginpassword']
        
        user = authenticate(useremail=loginemail, password=loginpassword)
                #Check for errorneous inputs
        #username should be under 10 characters
        if len(user) > 10:
            messages.error(request, "Username must be under 10 characters")
            return redirect('')
                # username should be alphanumeric
        if not user.isalnum():
            messages.error(request, "Username should only contain letters and numbers")
            return redirect('')
        
        if user is not None:
            login(request, user)
            messages.success(request, "Successfully Logged In")
            return redirect('chat.html') 
        else:
            messages.error(request, "Incorrect Credentials, Please try again")
            return redirect('')        
                
    else:
        return HttpResponse('404 - Not Found')
    
# def handleLogout(request): 
#     logout(request)
#     messages.success(request, "Successfully Logged Out")
#     return redirect('index')



# def analyze(request):
#     #Get the text
#     djtext = request.POST.get('text', 'default')

#     # Check checkbox values
#     removepunc = request.POST.get('removepunc', 'off')
#     fullcaps = request.POST.get('fullcaps', 'off')
#     newlineremover = request.POST.get('newlineremover', 'off')
#     extraspaceremover = request.POST.get('extraspaceremover', 'off')
#     numberremover = request.POST.get('numberremover','off')

#     #Check which checkbox is on
#     if removepunc == "on":
#         punctuations = '''!()-[]{};:'"\,<>./?@#$%^&*_~'''
#         analyzed = ""
#         for char in djtext:
#             if char not in punctuations:
#                 analyzed = analyzed + char

#         params = {'purpose':'Removed Punctuations', 'analyzed_text': analyzed}
#         djtext = analyzed

#     if(fullcaps=="on"):
#         analyzed = ""
#         for char in djtext:
#             analyzed = analyzed + char.upper()

#         params = {'purpose': 'Changed to Uppercase', 'analyzed_text': analyzed}
#         djtext = analyzed

#     if(extraspaceremover=="on"):
#         analyzed = ""
#         for index, char in enumerate(djtext):
#             # It is for if a extraspace is in the last of the string
#             if char == djtext[-1]:
#                     if not(djtext[index] == " "):
#                         analyzed = analyzed + char

#             elif not(djtext[index] == " " and djtext[index+1]==" "):                        
#                 analyzed = analyzed + char

#         params = {'purpose': 'Removed NewLines', 'analyzed_text': analyzed}
#         djtext = analyzed

#     if (newlineremover == "on"):
#         analyzed = ""
#         for char in djtext:
#             if char != "\n" and char!="\r":
#                 analyzed = analyzed + char

#         params = {'purpose': 'Removed NewLines', 'analyzed_text': analyzed}
    
#     if (numberremover == "on"):
#         analyzed = ""
#         numbers = '0123456789'

#         for char in djtext:
#             if char not in numbers:
#                 analyzed = analyzed + char
        
#         params = {'purpose': 'Removed NewLines', 'analyzed_text': analyzed}
#         djtext = analyzed

    
#     if(removepunc != "on" and newlineremover!="on" and extraspaceremover!="on" and fullcaps!="on" and numberremover != "on"):
#         return HttpResponse("please select any operation and try again")

#     return render(request, 'analyze.html', params)

#def about(request):
#    return render(request, 'about.html')
    
#def capfirst(request):
#    return HttpResponse("capitalize first")
#
#def newlineremove(request):
#    return HttpResponse("newline remove first")
#
#
#def spaceremove(request):
#    return HttpResponse("space remover back")
#
#def charcount(request):
#    return HttpResponse("charcount")
#!/usr/bin/env python3
"""
Google Search Tool using serper.dev API
Performs web searches and returns top 5 organic results
"""

import sys
import json
import os
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError


def search_google(query):
    """
    Search Google using serper.dev API
    
    Args:
        query: Search query string
        
    Returns:
        JSON string with top 5 results or error message
    """
    # Get API key from environment
    api_key = os.environ.get('SERPER_API_KEY')
    if not api_key:
        return json.dumps({
            "error": "SERPER_API_KEY environment variable not set. Get your API key from https://serper.dev"
        })
    
    # Prepare request
    url = 'https://google.serper.dev/search'
    headers = {
        'X-API-KEY': api_key,
        'Content-Type': 'application/json'
    }
    data = json.dumps({'q': query}).encode('utf-8')
    
    try:
        # Make POST request
        request = Request(url, data=data, headers=headers, method='POST')
        with urlopen(request, timeout=10) as response:
            result = json.loads(response.read().decode('utf-8'))
            
            # Extract top 5 organic results
            organic = result.get('organic', [])[:5]
            
            # Format results with only title, link, and snippet
            formatted_results = [
                {
                    'title': item.get('title', ''),
                    'link': item.get('link', ''),
                    'snippet': item.get('snippet', '')
                }
                for item in organic
            ]
            
            return json.dumps(formatted_results, indent=2)
            
    except HTTPError as e:
        return json.dumps({
            "error": f"HTTP Error {e.code}: {e.reason}",
            "details": "Check your SERPER_API_KEY or API quota"
        })
    except URLError as e:
        return json.dumps({
            "error": f"Network Error: {e.reason}",
            "details": "Check your internet connection"
        })
    except Exception as e:
        return json.dumps({
            "error": f"Unexpected error: {str(e)}"
        })


def main():
    """Main entry point for command-line usage"""
    if len(sys.argv) < 2:
        print(json.dumps({
            "error": "Usage: python3 google_search.py <query>"
        }))
        sys.exit(1)
    
    # Join all arguments as the query (handles multi-word queries)
    query = ' '.join(sys.argv[1:])
    
    # Perform search and print results
    result = search_google(query)
    print(result)


if __name__ == '__main__':
    main()

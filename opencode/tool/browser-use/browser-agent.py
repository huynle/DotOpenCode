#!/usr/bin/env python3
"""
Browser-Use Agent Wrapper Script

This script wraps the browser-use Python library for use with OpenCode tools.
It handles browser automation tasks and returns structured JSON results.
"""

import asyncio
import json
import sys
import argparse
import os
from typing import Any, Dict, Optional


def check_dependencies():
    """Check if required dependencies are installed."""
    try:
        import browser_use
        return True
    except ImportError:
        return False


async def run_browser_task(
    task: str,
    url: Optional[str] = None,
    use_cloud: bool = False,
    max_steps: int = 100,
    timeout: int = 300,
    chrome_profile_path: Optional[str] = None,
    headless: bool = False
) -> Dict[str, Any]:
    """
    Execute a browser automation task using browser-use.
    
    Args:
        task: Natural language description of the task
        url: Optional starting URL
        use_cloud: Whether to use Browser Use Cloud
        max_steps: Maximum number of steps
        timeout: Timeout in seconds
        chrome_profile_path: Path to Chrome user data directory (enables using existing profile with saved credentials)
        headless: Whether to run browser in headless mode (default: False for profile usage)
        
    Returns:
        Dictionary with task results
    """
    try:
        from browser_use import Agent, Browser, ChatBrowserUse
        from dotenv import load_dotenv
        
        # Load environment variables
        load_dotenv()
        
        # Initialize browser with optional Chrome profile
        if chrome_profile_path:
            # Use Chrome profile with saved credentials (no API key required for local profile)
            browser = Browser(
                user_data_dir=chrome_profile_path,
                headless=headless
            )
            # Initialize LLM - use local LLM or fallback
            try:
                llm = ChatBrowserUse()
            except Exception:
                # Fallback to a local LLM if cloud service is not available
                from browser_use import ChatOpenAI
                llm = ChatOpenAI(model="gpt-4o-mini")  # Fallback LLM
        else:
            # Check for API key when not using Chrome profile
            api_key = os.getenv("BROWSER_USE_API_KEY")
            if not api_key:
                return {
                    "success": False,
                    "error": "BROWSER_USE_API_KEY environment variable not set",
                    "help": "Get your free API key at https://cloud.browser-use.com/new-api-key"
                }
            
            # Use default browser configuration (cloud or local)
            browser = Browser(use_cloud=use_cloud)
            
            # Initialize LLM
            llm = ChatBrowserUse()
        
        # Modify task to include URL if provided
        full_task = task
        if url:
            full_task = f"Navigate to {url} and then: {task}"
        
        # Create agent
        agent = Agent(
            task=full_task,
            llm=llm,
            browser=browser,
            max_steps=max_steps
        )
        
        # Run task with timeout
        try:
            history = await asyncio.wait_for(
                agent.run(),
                timeout=timeout
            )
            
            # Extract results from history
            result = {
                "success": True,
                "task": task,
                "url": url,
                "result": "Task completed successfully",
                "history": str(history) if history else "No history available"
            }
            
            return result
            
        except asyncio.TimeoutError:
            return {
                "success": False,
                "error": f"Task timed out after {timeout} seconds",
                "task": task
            }
            
    except ImportError as e:
        return {
            "success": False,
            "error": "browser-use package not installed",
            "details": str(e),
            "help": "Install with: pip install browser-use"
        }
    except Exception as e:
        return {
            "success": False,
            "error": "Task execution failed",
            "details": str(e),
            "task": task
        }


def main():
    """Main entry point for the script."""
    parser = argparse.ArgumentParser(
        description="Browser-Use Agent Wrapper for OpenCode"
    )
    parser.add_argument(
        "--task",
        required=True,
        help="Natural language description of the task to perform"
    )
    parser.add_argument(
        "--url",
        help="Optional starting URL for the task"
    )
    parser.add_argument(
        "--use-cloud",
        action="store_true",
        help="Use Browser Use Cloud for stealth browsing"
    )
    parser.add_argument(
        "--max-steps",
        type=int,
        default=100,
        help="Maximum number of steps the agent can take"
    )
    parser.add_argument(
        "--timeout",
        type=int,
        default=300,
        help="Timeout in seconds"
    )
    parser.add_argument(
        "--chrome-profile",
        help="Path to Chrome user data directory (e.g., ~/Library/Application Support/Google/Chrome/Default on macOS)"
    )
    parser.add_argument(
        "--headless",
        action="store_true",
        help="Run browser in headless mode (not recommended when using Chrome profile)"
    )
    
    args = parser.parse_args()
    
    # Check dependencies
    if not check_dependencies():
        result = {
            "success": False,
            "error": "browser-use package not installed",
            "help": "Install with: pip install browser-use && uvx browser-use install"
        }
        print(json.dumps(result, indent=2))
        sys.exit(1)
    
    # Run the task
    try:
        result = asyncio.run(run_browser_task(
            task=args.task,
            url=args.url,
            use_cloud=args.use_cloud,
            max_steps=args.max_steps,
            timeout=args.timeout,
            chrome_profile_path=args.chrome_profile,
            headless=args.headless
        ))
        
        # Output result as JSON
        print(json.dumps(result, indent=2))
        
        # Exit with appropriate code
        sys.exit(0 if result.get("success", False) else 1)
        
    except KeyboardInterrupt:
        result = {
            "success": False,
            "error": "Task interrupted by user"
        }
        print(json.dumps(result, indent=2))
        sys.exit(1)
    except Exception as e:
        result = {
            "success": False,
            "error": "Unexpected error",
            "details": str(e)
        }
        print(json.dumps(result, indent=2))
        sys.exit(1)


if __name__ == "__main__":
    main()

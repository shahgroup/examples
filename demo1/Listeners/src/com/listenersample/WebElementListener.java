/*******************************************************************************
 *  QMetry Automation Framework provides a powerful and versatile platform to author 
 *  Automated Test Cases in Behavior Driven, Keyword Driven or Code Driven approach
 *                 
 *  Copyright 2016 Infostretch Corporation
 *
 *  This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or any later version.
 *
 *  This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 *
 *  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR
 *  OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT
 *  OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE
 *
 *  You should have received a copy of the GNU General Public License along with this program in the name of LICENSE.txt in the root folder of the distribution. If not, see https://opensource.org/licenses/gpl-3.0.html
 *
 *  See the NOTICE.TXT file in root folder of this source files distribution 
 *  for additional information regarding copyright ownership and licenses
 *  of other open source software / files used by QMetry Automation Framework.
 *
 *  For any inquiry or need additional information, please contact support-qaf@infostretch.com
 *******************************************************************************/
/**
 *  Below is listener example which is listen before web element's command execution.
 *  
 */

package com.listenersample;

import java.util.Arrays;

import org.openqa.selenium.remote.DriverCommand;
import org.openqa.selenium.remote.Response;

import com.qmetry.qaf.automation.ui.webdriver.CommandTracker;
import com.qmetry.qaf.automation.ui.webdriver.QAFExtendedWebElement;
import com.qmetry.qaf.automation.ui.webdriver.QAFWebElementCommandAdapter;
import com.qmetry.qaf.automation.util.StringUtil;

public class WebElementListener extends QAFWebElementCommandAdapter {

	/**
	 * Below method will be called before web element's command execution.
	 * 
	 * For example,
	 * 
	 * If element is visible then click.so you can check visibility in
	 * beforCommand and wait for visible.
	 * 
	 * 
	 * web driver send keys will append the text box, so each time we need to
	 * first call clear command and then use send keys command. so you can write
	 * {@link element#clear()}
	 * 
	 * 
	 * @param element
	 * @param commandTracker
	 */

	@Override
	public void beforeCommand(QAFExtendedWebElement element,
			CommandTracker commandTracker) {
		/*
		 * if (element.isPresent()) element.waitForVisible();
		 */
		if (commandTracker.getCommand().equalsIgnoreCase(DriverCommand.CLICK)) {
			if (element.isPresent() && !element.isEnabled())
				element.waitForVisible();
		}
		if (commandTracker.getCommand().equalsIgnoreCase(
				DriverCommand.SEND_KEYS_TO_ELEMENT)) {
			element.clear();
			String val = String.valueOf(commandTracker.getParameters().get(
					"value"));
			System.out.println("\n Before command" + val);

			if (StringUtil.isBlank(val)) {
				System.out.println("\n Returning value of sendKeysToElement");
				commandTracker.setResponce(new Response());
			}
		}

	}

	/**
	 * Below method will be called after web element's command execution.
	 * 
	 * Here it will print command name with parameter.
	 */

	@Override
	public void afterCommand(QAFExtendedWebElement element,
			CommandTracker commandTracker) {
		super.afterCommand(element, commandTracker);
		System.out.println(commandTracker.getCommand() + " has parameter:"
				+ commandTracker.getParameters());
	}

	/**
	 * Below method will be called on web element's command execution fail.
	 * 
	 * Here exception will set as null on failure of web element's command execution.
	 */

	@Override
	public void onFailure(QAFExtendedWebElement element,
			CommandTracker commandTracker) {
		super.onFailure(element, commandTracker);
		commandTracker.setException(null);
	}

	@Override
	protected void execute(QAFExtendedWebElement element,
			CommandTracker commandTracker) {
		super.execute(element, commandTracker);
	}

}

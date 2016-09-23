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
 *  Below is listener example which is listen before, after and on failure of web driver command execution.
 *  Here is also describe onInitialize and beforeInitialize method which is execute before initialize or at initialize time of web driver.
 */

package com.listenersample;

import org.openqa.selenium.Capabilities;

import org.openqa.selenium.remote.DriverCommand;
import org.openqa.selenium.remote.Response;

import com.qmetry.qaf.automation.ui.webdriver.CommandTracker;
import com.qmetry.qaf.automation.ui.webdriver.QAFExtendedWebDriver;
import com.qmetry.qaf.automation.ui.webdriver.QAFWebDriverCommandAdapter;

public class WebDriverListener extends QAFWebDriverCommandAdapter {

	/**
	 * Below method will be called before web driver's command execution.
	 * 
	 * Here beforeCommand will delete all cookies before web driver's command will be executed.
	 * 
	 * @param driver
	 * 
	 * @param commandTracker
	 */
	@Override
	public void beforeCommand(QAFExtendedWebDriver driver,
			CommandTracker commandTracker) {

		super.beforeCommand(driver, commandTracker);
		if (commandTracker.getCommand().equalsIgnoreCase(DriverCommand.GET)) {
			System.out.print("\nDelete Cookies :\n");
			driver.manage().deleteAllCookies();
		}
	}

	/**
	 * Below method will be called after web driver's command execution.
	 * 
	 * This can be used as intercepter. If you want to skip execution of actual
	 * command then set response in {@link CommandTracker#setResponce(Response)}
	 * 
	 * @param driver
	 * 
	 * @param commandTracker
	 * 
	 */
	@Override
	public void afterCommand(QAFExtendedWebDriver driver,
			CommandTracker commandTracker) {
		super.afterCommand(driver, commandTracker);
		String cmd = commandTracker.getCommand();
		// Ignore command and set new response for getCurrentWindowHandle
		if (cmd.equalsIgnoreCase(DriverCommand.GET_CURRENT_WINDOW_HANDLE)) {
			/*
			 * System.out.println("Skip execution:");
			 */commandTracker.setResponce(new Response());
		}
	}

	/**
	 * Below method will be called on failure of web driver's
	 * command execution.
	 * 
	 * This can be used to propagate exception. You can get information about
	 * from where exception thrown by inspecting
	 * {@link CommandTracker#getStage()}
	 * 
	 * @param driver
	 * 
	 * @param commandTracker
	 */
	@Override
	public void onFailure(QAFExtendedWebDriver driver,
			CommandTracker commandTracker) {
		super.onFailure(driver, commandTracker);
		System.out.println("Failure at :" + commandTracker.getStage());
	}

	/**
	 * Below method will be called immediately when new driver instance is
	 * created.
	 * 
	 * Here you will see maximize window immediately after new driver instance is
	 * created.
	 * 
	 * @param driver
	 */
	@Override
	public void onInitialize(QAFExtendedWebDriver driver) {
		driver.manage().window().maximize();

	}

	/**
	 * You can specify additional desired capabilities for the driver before
	 * initialization.
	 * 
	 * @param desiredCapabilities
	 */
	@Override
	public void beforeInitialize(Capabilities desiredCapabilities) {
		System.out.println("\nGet Browser name using desiredcapabilies = "
				+ desiredCapabilities.getBrowserName());

	}
}

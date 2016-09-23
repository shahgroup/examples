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
package com.testSuite;

import static com.qmetry.qaf.automation.step.CommonStep.assertLinkWithPartialTextPresent;
import static com.qmetry.qaf.automation.step.CommonStep.click;
import static com.qmetry.qaf.automation.step.CommonStep.sendKeys;
import static com.qmetry.qaf.automation.step.CommonStep.get;

import javax.ws.rs.GET;

import org.testng.annotations.Test;

import com.qmetry.qaf.automation.ui.WebDriverTestCase;

public class suite1 extends WebDriverTestCase {

	/** This example demonstrate WebListener/WebElement/Step listener
	 * 
	 * on Execution of {@link GET} command WebListerner will execute.
	 * on Execution of {@link SendKeys} command WebElement will execute and search for text using
	 * text.google.search
	 * After search ,element will be clean and execute other {@link SendKeys} using "Infostretch"
	 * keyword
	 * Here while executing each and every step Step Listener will be called
	 * 
	 *  To register one or more listener you need to set appropriate property into
	 *  application.properties file.
 		wd.command.listeners= com.listenersample.WebDriverListener
 		we.command.listeners=com.listenersample.WebElementListener
 		teststep.listeners=com.listenersample.TestStepTrackListener
	 * 
	 * 
	 */
	@Test(groups = { "SMOKE" }, description = "Listener Scenario")
	public void Listener_Scenario() {
		get("/");
		sendKeys("QMetry Automation Studio", "text.google.search");
		click("submit.google.search");
		sendKeys("Infostretch", "text.google.search");
		click("submit.google.search");
		assertLinkWithPartialTextPresent("InfoStretch");
	}
}

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
 * 
 */
package com.testSuite;

import com.qmetry.qaf.automation.core.MessageTypes;
import com.qmetry.qaf.automation.step.CommonStep;
import com.qmetry.qaf.automation.step.QAFTestStep;
import com.qmetry.qaf.automation.util.Reporter;

/**
 * @author mishal.shah
 *
 */
public class StepsBackLog {

	private long stTime;

	@QAFTestStep(description = "user should find result with {searchTerm}")
	public void userShouldFindResultWith(String str1) {
		long stTime = System.currentTimeMillis();
		CommonStep.sendKeys(str1, "text.google.search");
		CommonStep.click("submit.google.search");
		long dur = System.currentTimeMillis() - stTime;
		Reporter.log("This took " + dur, MessageTypes.Info);
	}

	@QAFTestStep(description = "user search for {0}")
	public void userSearchFor(String str1) {
		// TODO: call test steps
	}

	@QAFTestStep(description = "Strat time tracking")
	public void stratTimeTracking() {
		  stTime = System.currentTimeMillis();
		
	}

	@QAFTestStep(description = "Stop Time Tracking")
	public void stopTimeTracking() {
		long dur = System.currentTimeMillis() - stTime;

		Reporter.log("This took " + dur, MessageTypes.Info);

	}

}

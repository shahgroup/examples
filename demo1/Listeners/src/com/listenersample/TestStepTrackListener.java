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
 *  Below is listener example which is listen before, after and on failure of test-step.
 *  
 */

package com.listenersample;

import com.qmetry.qaf.automation.step.QAFTestStepListener;
import com.qmetry.qaf.automation.step.StepExecutionTracker;

public class TestStepTrackListener implements QAFTestStepListener {

	/**
	 * Below method will be called before test step execution.
	 * 
	 * It will print test step name and arguments.
	 * 
	 * @param stepExecutionTracker
	 */
	long start;
	@Override
	public void beforExecute(StepExecutionTracker stepExecutionTracker) {
		start = System.currentTimeMillis();
		 
	}

	/**
	 * Below method will be called after test step execution. Here you can
	 * exception print or clear.
	 * 
	 * It will print test step name and result of test step (success or fail).
	 * 
	 * @param stepExecutionTracker
	 */
	@Override
	public void afterExecute(StepExecutionTracker stepExecutionTracker) {
		 long elapsed = System.currentTimeMillis() - start;
		 

		 String desc =  stepExecutionTracker.getStep().getDescription() + "[" + elapsed +"ms]";
		 stepExecutionTracker.getStep().setDescription(desc);
	}

	@Override
	public void onFailure(StepExecutionTracker stepExecutionTracker) {
		System.out.println("Failure with step" + stepExecutionTracker.getStep().getDescription() + "is " +
				stepExecutionTracker.getException());
				
	}

}

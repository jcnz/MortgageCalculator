import {IInputs, IOutputs} from "./generated/ManifestTypes";

export class MortgageCal implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	/**
	 * Empty constructor.
	 */
	constructor()
	{
			
	}

	// Reference to the control container HTMLDivElement
	// This element contains all elements of our custom control example
	private _container: HTMLDivElement;

	private _resultcontainer : HTMLDivElement;

	// Flag if control view has been rendered
	private _controlViewRendered: Boolean;

	private _loanAmount : HTMLInputElement;
	private _interestRate : HTMLInputElement;
	private _term : HTMLInputElement;
	private _repaymentAmount : HTMLLabelElement;
	private _totalAmountPaid : HTMLLabelElement;
	private _totalInterestPaid : HTMLLabelElement;

	private _termLabel : HTMLLabelElement;
	
	// // Event Handelr 'refreshData' reference
	// private _refreshData: EventListenerOrEventListenerObject;
        
	
	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='starndard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{
		// Add control initialization code
		this._controlViewRendered = false;
		
			this._container = document.createElement("div");
			this._container.classList.add("MortgageContainer");
			this._resultcontainer = document.createElement("div");
			this._resultcontainer.classList.add("ResultContainer");
			container.appendChild(this._container);
			container.appendChild(this._resultcontainer);
	}

   /**
		 * Updates the values to the internal value variable we are storing and also updates the html label that displays the value
		 * @param evt : The "Input Properties" containing the parameters, control metadata and interface functions
		 */
        public refreshData(evt: Event) : void
        {
           //  this._term = (this._term.value as any)as number;
            // this.labelElement.innerHTML = this.inputElement.value;
            // this._notifyOutputChanged();
        }

	/**
		 * Input Blur Event handler for the input created as part of this control
		 * @param input 
		 */
		public onChange(input: number) : void {
			console.log("ON CHANGE EVENT");
			let inputNumber = Number(input);
			console.log(inputNumber);
			// this._value = isNaN(inputNumber) ? (this.label.value as any) as number: inputNumber;
			// this._notifyOutputChanged();
		}

		/**
		 * Format the input value
		 * @param event
		 */
		private FormatValue(event: Event): void {
			let amount = this.InsertCommaIntoValue(this._loanAmount.value.replace('$', '').replace(/,/g, ''));
			this._loanAmount.value ="$" + amount;
		}

		/**
		 * Input Blur Event handler for the input created as part of this control
		 * @param event
		 */
		private CalculateRepayments(event: Event): void {
			let loanamount = Number(this._loanAmount.value.replace('$', '').replace(/,/g, ''));
			//this._value = isNaN(inputNumber) ? (this.label.value as any) as number: inputNumber;
			console.log("Loan Amount : " + loanamount);
			let interest = Number(this._interestRate.value);
			console.log("Interest Rate : " + interest);
			let term = Number(this._term.value);
			console.log("Term : " + term);
			let repaymentamount = Number(this._repaymentAmount.innerText);
			console.log("Repayment Amount : " + repaymentamount);

			//this._rateLabel = (this._term.value as any)as number;
            this._termLabel.innerHTML = this._term.value;

			if (!isNaN(loanamount) && !isNaN(interest) && !isNaN(term))
			{
				let months = term * 12;
				let monthlyint = (interest/100)/12;
				// calculate repayment
				let calculated = loanamount*(monthlyint * Math.pow((1 + monthlyint), months))/(Math.pow((1 + monthlyint), months) - 1);
				if (!isNaN(calculated))
				{
					this._repaymentAmount.innerText = "$" + this.InsertCommaIntoValue(this.RoundHalfDown(calculated).toString());
					let totalAmt = this.RoundHalfDown(calculated * months);
					this._totalAmountPaid.innerText = "$" +  this.InsertCommaIntoValue(totalAmt.toString());
					this._totalInterestPaid.innerText = "$" + this.InsertCommaIntoValue((totalAmt - loanamount).toString());
				}
				else
				{
					this._repaymentAmount.innerText = "";
				}
			}
		}


		private RoundHalfDown(num : number) {
			return -Math.round(-num);
		}
		
		
		// function to format the currency display in input fields
		
		private InsertCommaIntoValue(strVal : string) {
			return strVal.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
		}

/** 
		* Creates an HTML Table that showcases examples of basic methods available to the custom control
		* The left column of the table shows the method name or property that is being used
		* The right column of the table shows the result of that method name or property
		*/
		private createHTMLTableElement(): HTMLTableElement
		{
			// Create HTML Table Element
			let tableElement: HTMLTableElement = document.createElement("table");
			tableElement.setAttribute("class", "SampleControlHtmlTable_HtmlTable");

			// Create header row for table
			let key: string = "Mortgage Calculator";
			let value: string = "";
			let blank = document.createElement("input");
			tableElement.appendChild(this.createHTMLTableRowElement(key, value, blank , true));

			
			key = "Loan Amount";
			this._loanAmount = document.createElement("input");
			this._loanAmount.setAttribute("type","text");
			this._loanAmount.addEventListener("focusout", this.FormatValue.bind(this));
			this._loanAmount.addEventListener("focusout", this.CalculateRepayments.bind(this));
	
			tableElement.appendChild(this.createHTMLTableRowElement(key, "", this._loanAmount, false));

			key = "Interest Rate (% p.a.)";
			this._interestRate = document.createElement("input");
			this._interestRate.setAttribute("type","text");
			this._interestRate.addEventListener("focusout", this.CalculateRepayments.bind(this));
			
			tableElement.appendChild(this.createHTMLTableRowElement(key, "",this._interestRate, false));

			key = "Term (Years)";
			this._term = document.createElement("input");

			this._term.setAttribute("type","range");
          //  this._term.addEventListener("input",this.refreshData.bind(this));

            //setting the max and min values for the control.
            this._term.setAttribute("min","1");
			this._term.setAttribute("max","30");
			this._term.setAttribute("value","30");
            this._term.setAttribute("class","linearslider");
            this._term.setAttribute("id","linearrangeinput");

		
			this._term.addEventListener("input", this.CalculateRepayments.bind(this));
		
			tableElement.appendChild(this.createHTMLTableRowElement(key, "", this._term, false));

			key = "";
			this._termLabel = document.createElement("label");
          //  this._termLabel.setAttribute("class", "ResultsLabel");
            this._termLabel.setAttribute("id","lrclabel");
			tableElement.appendChild(this.createHTMLTableRowLabelElement(key, this._termLabel, false));

			// key = "Repayment Amount";
			// this._repaymentAmount = document.createElement("input");
			// this._repaymentAmount.setAttribute("type","text");
			// this._repaymentAmount.addEventListener("focusout", this.CalculateRepayments.bind(this));
			// tableElement.appendChild(this.createHTMLTableRowElement(key, "", this._repaymentAmount, false));

		
			return tableElement;
		}


		private createResultHTMLTableElement(): HTMLTableElement
		{
			// Create HTML Table Element
			let tableElement: HTMLTableElement = document.createElement("table");
			tableElement.setAttribute("class", "SampleControlResultsHtmlTable_HtmlTable");

			// Create header row for table
			let key: string = "Results";
			let value: string = "";
			let blank = document.createElement("input");
			tableElement.appendChild(this.createHTMLTableRowElement(key, value, blank , true));

			
			key = "Monthly Repayment Amount";
			//this._repaymentAmount = document.createElement("input");
			this._repaymentAmount = document.createElement("label");
			this._repaymentAmount.setAttribute("type","label");
			this._repaymentAmount.setAttribute("class", "ResultsLabel");
			this._repaymentAmount.addEventListener("focusout", this.CalculateRepayments.bind(this));
			tableElement.appendChild(this.createHTMLTableRowLabelElement(key, this._repaymentAmount, false));

			this._totalAmountPaid = document.createElement("label");
			this._totalAmountPaid.setAttribute("type","label");
			this._totalAmountPaid.setAttribute("class", "ResultsLabel");
			tableElement.appendChild(this.createHTMLTableRowLabelElement("Total Amount Paid",this._totalAmountPaid, false));

			this._totalInterestPaid = document.createElement("label");
			this._totalInterestPaid.setAttribute("type","label");
			this._totalInterestPaid.setAttribute("class", "ResultsLabel");
			tableElement.appendChild(this.createHTMLTableRowLabelElement("Total Interest Paid",this._totalInterestPaid, false));

			// key = "Monthly Repayments";
			// let mirrored = document.createElement("input");
			// mirrored.setAttribute("type","label");
			// mirrored = this._repaymentAmount;
		
			//tableElement.appendChild(this.createHTMLTableRowElement(key, value,mirrored, false));

					
			return tableElement;
		}


	/**
		 * Helper method to create an HTML Table Row Element
		 * 
		 * @param key : string value to show in left column cell
		 * @param inputElement : input element to show in right column cell
		 * @param isHeaderRow : true if method should generate a header row
		 */
		private createHTMLTableRowLabelElement(key: string, inputElement: HTMLLabelElement,  isHeaderRow: boolean): HTMLTableRowElement
		{
			let keyCell: HTMLTableCellElement = this.createHTMLTableCellElement(key, "SampleControlHtmlTable_HtmlCell_Key", isHeaderRow);
			

			let rowElement: HTMLTableRowElement = document.createElement("tr");
			rowElement.setAttribute("class", "SampleControlHtmlTable_HtmlRow");
			rowElement.appendChild(keyCell);

		
			let valueCell: HTMLTableCellElement = this.createHTMLTableLabelCellElement(inputElement, "SampleControlHtmlTable_HtmlCell_Value", isHeaderRow);
		
	

			rowElement.appendChild(valueCell);

			return rowElement;
		}


		/**
		 * Helper method to create an HTML Table Row Element
		 * 
		 * @param key : string value to show in left column cell
		 * @param value : string value to show in right column cell
		 * @param inputElement : input element to show in right column cell
		 * @param isHeaderRow : true if method should generate a header row
		 */
		private createHTMLTableRowElement(key: string, value: string, inputElement: HTMLInputElement,  isHeaderRow: boolean): HTMLTableRowElement
		{
			let keyCell: HTMLTableCellElement = this.createHTMLTableCellElement(key, "SampleControlHtmlTable_HtmlCell_Key", isHeaderRow);
			

			let rowElement: HTMLTableRowElement = document.createElement("tr");
			rowElement.setAttribute("class", "SampleControlHtmlTable_HtmlRow");
			rowElement.appendChild(keyCell);

			let valueCell: HTMLTableCellElement = this.createHTMLTableCellElement(value, "SampleControlHtmlTable_HtmlCell_Value", isHeaderRow);
			if (value != "" && value != null)
			{
				valueCell = this.createHTMLTableCellElement(value, "SampleControlHtmlTable_HtmlCell_Value", isHeaderRow);
				rowElement.appendChild(valueCell);
			}
			else if (inputElement.attributes.length >= 1)
			{
				valueCell = this.createHTMLTableInputCellElement(inputElement, "SampleControlHtmlTable_HtmlCell_Value", isHeaderRow);
				rowElement.appendChild(valueCell);
			}
	

			

			return rowElement;
		}

		/**
		 * Helper method to create an HTML Table Cell Element
		 * 
		 * @param cellValue : string value to inject in the cell
		 * @param className : class name for the cell
		 * @param isHeaderRow : true if method should generate a header row cell
		 */
		private createHTMLTableCellElement(cellValue: string, className: string, isHeaderRow: boolean): HTMLTableCellElement
		{
			let cellElement: HTMLTableCellElement;
			if (isHeaderRow)
			{
				cellElement = document.createElement("th");
				cellElement.setAttribute("class", "SampleControlHtmlTable_HtmlHeaderCell " + className);
				cellElement.setAttribute("colspan","2");
			}
			else
			{
				cellElement = document.createElement("td");
				cellElement.setAttribute("class", "SampleControlHtmlTable_HtmlCell " + className);
			}

			let textElement: Text = document.createTextNode(cellValue);
		

			cellElement.appendChild(textElement);
			return cellElement;
		}

			/**
		 * Helper method to create an HTML Table Cell Element
		 * 
		 * @param cellValue : string value to inject in the cell
		 * @param className : class name for the cell
		 * @param isHeaderRow : true if method should generate a header row cell
		 */
		private createHTMLTableInputCellElement(cellValue: HTMLInputElement, className: string, isHeaderRow: boolean): HTMLTableCellElement
		{
			let cellElement: HTMLTableCellElement;
			if (isHeaderRow)
			{
				cellElement = document.createElement("th");
				cellElement.setAttribute("class", "SampleControlHtmlTable_HtmlHeaderCell " + className);
			}
			else
			{
				cellElement = document.createElement("td");
				cellElement.setAttribute("class", "SampleControlHtmlTable_HtmlCell " + className);
			}

			//let textElement: Text = document.createElement(cellValue);
		

			cellElement.appendChild(cellValue);
			return cellElement;
		}

				/**
		 * Helper method to create an HTML Table Cell Element
		 * 
		 * @param cellValue : string value to inject in the cell
		 * @param className : class name for the cell
		 * @param isHeaderRow : true if method should generate a header row cell
		 */
		private createHTMLTableLabelCellElement(cellValue:HTMLLabelElement, className: string, isHeaderRow: boolean): HTMLTableCellElement
		{
			let cellElement: HTMLTableCellElement;
			if (isHeaderRow)
			{
				cellElement = document.createElement("th");
				cellElement.setAttribute("class", "SampleControlHtmlTable_HtmlHeaderCell " + className);
			}
			else
			{
				cellElement = document.createElement("td");
				cellElement.setAttribute("class", "SampleControlHtmlTable_HtmlCell " + className);
			}

			//let textElement: Text = document.createElement(cellValue);
		

			cellElement.appendChild(cellValue);
			return cellElement;
		}

	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		// Add code to update control view
		if (!this._controlViewRendered)
		{
				// Render and add HTMLTable to the custom control container element
				let tableElement: HTMLTableElement = this.createHTMLTableElement();
				this._container.appendChild(tableElement);

				let resultTableElement: HTMLTableElement = this.createResultHTMLTableElement();
				this._resultcontainer.append(resultTableElement);
				// Render and add set full screen button to the custom control container element
				// this._setFullScreenButton = this.createHTMLButtonElement(
				// 	this.getSetFullScreenButtonLabel(!this._isFullScreen),
				// 	this.onSetFullScreenButtonClick.bind(this),
				// 	null);

				// 	this._container.appendChild(this._setFullScreenButton);
				
				this._termLabel.setAttribute("value",this._term.value);
				this._termLabel.innerHTML = this._term.value;

				this._controlViewRendered = true;
		}
	}



	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		return {};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		// Add code to cleanup control if necessary
	}
}
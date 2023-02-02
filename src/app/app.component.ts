import { Component, OnInit } from '@angular/core';

interface Tag {
  name: string,
  className: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  
  title = 'learn';

  isAnalyse = true;
  inputValue:string;
  text: string;
  showText: any[] = [];
  isHighlighting: {startId:string, status: boolean, xCord:number};
  shallCapture: boolean;
  tags: Tag[] = [];
  selectedTag: Tag;
  result:string;

  ngOnInit(): void {
    
  }

  down(id: string, event: MouseEvent){
    this.isHighlighting = {
      startId : id,
      status : true,
      xCord : event.screenX
    };
  }

  up(id:string){
    if(this.shallCapture && !!this.selectedTag){
      const firstIndex = this.showText.findIndex(el => {return el.id === this.isHighlighting.startId});
      const secondIndex = this.showText.findIndex(el => {return el.id === id});
      let highLightedArray = [];
      
      if(firstIndex > secondIndex){
        highLightedArray = this.showText.slice(secondIndex, (firstIndex + 1));
      }else if(secondIndex > firstIndex){
        highLightedArray = this.showText.slice(firstIndex, (secondIndex + 1));
      }else{
        highLightedArray = [this.showText[firstIndex]];
      }
      
      highLightedArray.push({
        type: 'button'
      });

      const mark = {
        type : 'mark',
        id : `mark${highLightedArray[0].id}`,
        tag: this.selectedTag,
        spans : highLightedArray
      }
      
      if(firstIndex > secondIndex){
        this.showText.splice(secondIndex, (firstIndex - secondIndex + 1), mark);
      }else if(secondIndex > firstIndex){
        this.showText.splice(firstIndex, (secondIndex - firstIndex + 1), mark);
      }else{
        this.showText.splice(firstIndex, 1, mark);
      }
    }
      
    this.isHighlighting = null;
    this.shallCapture = false;
  }

  move(event: MouseEvent){
    if(!this.shallCapture && this.isHighlighting?.status && 
      Math.abs(this.isHighlighting.xCord - event.screenX) > 3){
        this.shallCapture = true;
    }
  }

  deleteMark(id: string){
    const markIndex = this.showText.findIndex(el => el.id == id);
    const spans = this.showText[markIndex].spans;
    spans.pop();
    this.showText.splice(markIndex, 1, ...spans); 
  }

  toggleTag(tag:Tag){
    if(this.selectedTag?.name == tag.name){
      this.selectedTag = null;
    }else{
      this.selectedTag = tag;
    }
  }

  openTagModal(){
    const tagName = prompt('Enter New Tag Name');
    if(tagName){
      this.tags.push({
        name: tagName,
        className: `mark${this.tags.length%5}`
      })
    }    
  }

  save(){
    const marked = this.showText.filter(node => node.type == 'mark').map(marked => {
      return [marked.spans[0].start, marked.spans[marked.spans.length - 2].end, marked.tag.name]
    });
    this.result = JSON.stringify(marked);

  }

  onAnalyse(){
    // this.text = this.inputValue;
    let pointer = 0;
    this.showText = this.text.split(' ').map(txt =>{
      const start = pointer;
      const end = pointer + txt.length - 1;
      pointer = pointer + txt.length + 1
      return {
        id: `txt${start}`,
        value: txt,
        type: 'span',
        start,
        end
      }
    });
    this.isAnalyse = false;
  }

  onReset(){
    this.text = this.result = null;
    this.showText = [];
    this.isAnalyse = true;
  }

}

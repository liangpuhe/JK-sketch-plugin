const { Document, Rectangle, ShapePath, Text, Group, Types, Style } = require("sketch/dom");

const TEXT_STYLE = {
  textColor: '#EC1300',
  fontSize: 12,
  borders: []
};

const TEXT_CENTER = Text.Alignment.center;
const TEXT_RIGHT = Text.Alignment.right;
const TEXT_LEFT = Text.Alignment.left;

var onRun = function(context) {
  const UI = require("sketch/ui");

  const document = Document.getSelectedDocument();
  if(!document){
    UI.message("⚠️ Please select/focus a document.");
    return;
  }

  const page = document.selectedPage;
  const selectedLayers = document.selectedLayers.layers;
  if(!selectedLayers){
    UI.message("⚠️ Please select a layer.");
    return;
  }
  selectedLayers.forEach((selectedLayer, j) => {
    const i = j + 1;
    let myFrame = selectedLayer.frame;
    const cssAttributes = selectedLayer.sketchObject.CSSAttributes();
    let textToDisplay = '';
    cssAttributes.forEach((item, i) => {
      const arr = item.split(': ');
      textToDisplay = textToDisplay.concat(arr[1], '\n');
    });

    const rect = new ShapePath({
        shapeType: ShapePath.ShapeType.Rectangle,
        name: "outline_" + i,
        parent: page,
        frame: myFrame,
        style: {
          borders: [
            {
              color: '#EC1300',
              fillType: Style.FillType.Color,
              position: Style.BorderPosition.Inside,
              thickness: 1
            }
          ]
        }
    });

    const centerTextFrame = new Rectangle(myFrame.x, myFrame.y + myFrame.height/2 - 6, myFrame.width, 12);
    const centerText = new Text({
      text: 'div ' + i,
      alignment: Text.Alignment.left,
      name: "div_" + i,
      parent: page,
      frame: centerTextFrame,
      style: TEXT_STYLE,
      fixedWidth: true
    });

    createVerticalLineAnatomy(i, page, myFrame);
    createHorizontalLineAnatomy(i, page, myFrame);
    createCSSLine(i, page, myFrame, textToDisplay);
  });
};

function createCSSLine(i, page, myFrame, textToDisplay) {
  const group = new Group({
    name: 'CSS_group_' + i,
    parent: page,
  });
  const isOdd = i % 2;
  const len = 200 + 50 * (i % 2);
  const xValue = isOdd ? (myFrame.x - len) : (myFrame.x + myFrame.width - 2);
  const lineFrame = new Rectangle(xValue, myFrame.y + myFrame.height/4, len + 2, 1);
  createLine(group, lineFrame, 'line_' + i);

  const textXValue = isOdd ? (myFrame.x - len) : (myFrame.x + myFrame.width);
  const textFrame = new Rectangle(textXValue, myFrame.y + myFrame.height/4, len + 2, len);
  const text = new Text({
    text: textToDisplay,
    name: "css_" + i,
    parent: group,
    frame: textFrame,
    style: getTextStyle(isOdd ? 'left' : 'right'),
    fixedWidth: false
  });
}

function createVerticalLineAnatomy(i, page, myFrame) {
  const group = new Group({
    name: 'height_group_' + i,
    parent: page,
  });
  const lineFrame = new Rectangle(myFrame.x - 5, myFrame.y, 1, myFrame.height);
  createLine(group, lineFrame, 'line_' + i);

  const startLineFrame = new Rectangle(myFrame.x - 8, myFrame.y + 0.5, 6, 1);
  createLine(group, startLineFrame, 'start_dash_' + i);

  const endLineFrame = new Rectangle(myFrame.x - 8, myFrame.y + myFrame.height - 0.5, 6, 1);
  createLine(group, endLineFrame, 'end_dash_' + i);

  const textFrame = new Rectangle(myFrame.x - 27, myFrame.y + myFrame.height/2 - 6, 5, 5);
  const text = new Text({
    text: myFrame.height + ' px',
    alignment: TEXT_RIGHT,
    name: "height_" + i,
    parent: group,
    frame: textFrame,
    style: TEXT_STYLE,
    fixedWidth: false
  });
};

function createHorizontalLineAnatomy(i, page, myFrame) {
  const group = new Group({
    name: 'width_group_' + i,
    parent: page,
  });
  const lineFrame = new Rectangle(myFrame.x, myFrame.y - 5, myFrame.width, 1);
  createLine(group, lineFrame, 'line_' + i);

  const startLineFrame = new Rectangle(myFrame.x + 0.5, myFrame.y- 8, 1, 6);
  createLine(group, startLineFrame, 'start_dash_' + i);

  const endLineFrame = new Rectangle(myFrame.x + myFrame.width - 0.5, myFrame.y  - 8, 1, 6);
  createLine(group, endLineFrame, 'end_dash_' + i);

  const textFrame = new Rectangle(myFrame.x + myFrame.width/2 , myFrame.y - 19, 5, 5);
  const text = new Text({
    text: myFrame.width + ' px',
    alignment: TEXT_CENTER,
    name: "width_" + i,
    parent: group,
    frame: textFrame,
    style: TEXT_STYLE
  });
};

function createLine(group, frame, name) {
  const myLine = new ShapePath({
    name: name,
    frame: frame,
    style: {
      borders: ['#EC1300'],
      alignment: 'center'
    },
    points: [
      { point: { x: 0, y: 0 }},
      { point: { x: frame.width === 1 ? 0 : 1, y: frame.height === 1 ? 0 : 1 }}
    ],
    parent: group
  })
};

function getTextStyle(alignment) {
  return {
    textColor: '#EC1300',
    fontSize: 12,
    borders: [],
    alignment: alignment,
    paragraphSpacing: 0
  }
}

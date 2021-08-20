import {
  Button,
  Col,
  List,
  Progress,
  Row,
  Space,
  Tree,
  Typography,
} from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import React, { useEffect, useState, useCallback } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.global.css';
import { DataNode } from 'antd/lib/tree';
import { Key } from 'rc-tree/lib/interface';
import { addChildren } from './utils/treeData';
import {
  retriveDirectories,
  scanAllFiles,
  SearchResult,
} from './utils/fileHelper';
import searchWord from './utils/searchHelper';

const { Title, Text } = Typography;
const { DirectoryTree } = Tree;

const ROOT_DIR = '/';

interface DirInfo {
  selectedDir: string | null;
  totalFiles: number;
}

interface IProgress {
  percent: number;
  file: string;
  result: SearchResult[];
  totalFiles: number;
}

const Home = () => {
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [dirInfo, setDirInfo] = useState<DirInfo>({
    selectedDir: null,
    totalFiles: 0,
  });
  const [progress, setProgress] = useState<IProgress>({
    percent: 0,
    file: '',
    result: [],
    totalFiles: 0,
  });
  const [scanning, setScanning] = useState(false);

  const resetDirectories = useCallback(() => {
    const data = retriveDirectories(ROOT_DIR);
    setTreeData([
      {
        title: ROOT_DIR,
        key: ROOT_DIR,
        isLeaf: false,
        children: data,
      },
    ]);
  }, []);

  useEffect(() => {
    resetDirectories();
  }, [resetDirectories]);

  const handleOnExpand = (keys: Key[], info: any) => {
    if (info.expanded) {
      const data = retriveDirectories(info.node.key);
      const result = addChildren(data, info.node, treeData[0]);
      setTreeData([result]);
      setExpandedKeys(keys);
    } else {
      const index = expandedKeys.indexOf(info.node.key);
      setExpandedKeys((value) => {
        const values = [...value];
        values.splice(index);
        return values;
      });
    }
  };

  const handleOnSelect = (_keys: any, info: any) => {
    setDirInfo((value) => {
      return {
        ...value,
        selectedDir: info.node.key,
      };
    });
  };

  const handleScanButtonClick = () => {
    const files: string[] = [];
    let totalFiles = 0;

    setScanning(true);

    if (dirInfo.selectedDir) {
      scanAllFiles(dirInfo.selectedDir, files);
      totalFiles = files.length;
      setDirInfo((value) => {
        return {
          ...value,
          totalFiles,
        };
      });
    }

    searchWord('todo', files, (index, file) => {
      setProgress({
        result: [],
        percent: Math.ceil(((index + 1) / totalFiles) * 100),
        file,
        totalFiles: 0,
      });
    })
      .then((result) => {
        setScanning(false);
        setProgress({
          percent: 0,
          file: '',
          result,
          totalFiles: result.length,
        });
        return result;
      })
      .catch((err) => console.log(err));
  };

  const handleRefreshClick = () => {
    setExpandedKeys([]);
    resetDirectories();
  };

  const hasResult = progress.totalFiles > 0;

  return (
    <div
      style={{
        width: '90vw',
      }}
    >
      <Space align="start" size="large">
        <Title style={{ marginBottom: 0 }} level={3}>
          TODO Scanner
        </Title>
        <Button onClick={handleRefreshClick} icon={<SyncOutlined />}>
          Refresh
        </Button>
      </Space>
      <div
        style={{
          overflow: 'auto',
          height: 300,
          marginTop: 20,
          background: 'white',
        }}
      >
        <DirectoryTree
          disabled={scanning}
          treeData={treeData}
          onExpand={handleOnExpand}
          onSelect={handleOnSelect}
          expandedKeys={expandedKeys}
        />
      </div>
      <Row align="middle" justify="space-between" style={{ marginTop: 20 }}>
        <Col>
          <Text style={{ fontWeight: 'bold' }}>{`Path: ${
            dirInfo.selectedDir || '-'
          }`}</Text>
        </Col>
        <Col>
          <Button
            disabled={!dirInfo.selectedDir || scanning}
            onClick={handleScanButtonClick}
          >
            Scan
          </Button>
        </Col>
      </Row>
      {scanning ? (
        <Row style={{ marginTop: 20 }}>
          <Progress
            percent={progress.percent}
            status="active"
            showInfo={false}
          />
          <Text
            ellipsis
          >{`Scanning(${dirInfo.totalFiles}): ${progress.file}`}</Text>
        </Row>
      ) : (
        <Row style={{ marginTop: 20 }}>
          <Text>{`Result: ${progress.totalFiles} todo(s) found.`}</Text>
        </Row>
      )}
      {hasResult ? (
        <Row style={{ marginTop: 8 }}>
          <List
            style={{
              height: 300,
              width: '100%',
              overflow: 'auto',
              background: 'white',
            }}
            size="small"
            bordered
            dataSource={progress.result}
            renderItem={(item) => (
              <List.Item>
                <Space direction="vertical" size={0}>
                  <Text type="secondary">{`Line #${item.lineNo}`}</Text>
                  <Text>{`${item.path}`}</Text>
                </Space>
              </List.Item>
            )}
          />
        </Row>
      ) : null}
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Home} />
      </Switch>
    </Router>
  );
}
